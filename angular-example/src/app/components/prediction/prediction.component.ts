import {Component, ElementRef, ViewChild} from '@angular/core';
import {InputBarComponent} from "../input-bar/input-bar.component";
import {PredictionResultsComponent} from "./prediction-results/prediction-results.component";
import {Engine} from "../../model/engine";
import {FileState} from "../../model/file-state";
import {FILE_MAX_LIMIT_BYTES, QualityAttribute, qualityAttributes} from "../../constants/quality.constants";
import {catchError, finalize, Observable, Subscription, tap} from "rxjs";
import {MessageService} from "primeng/api";
import {DocumentFileType, isPdf, isTiff} from "../../model/document-file-type"
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {
  calculatePDFPages,
  checkFilePasswordProtection,
  checkPDFPasswordProtection,
  fileTypeHeaders,
  getFileHeader
} from "../../utils/file-utils";
import {DialogComponent} from "../../commons/dialog/dialog.component";
import {TimerObservable} from "rxjs-compat/observable/TimerObservable";
import {passwordTranslationMapping, supportedPasswordErrorCode} from "../../constants/password-errors.constants";
import {QualityService} from "../../services/quality-service";
import {Token} from "../../model/token";
import {translate} from "@ngneat/transloco";
import {getErrorMessage} from "../../utils/validation-utils";

declare var Tiff: any;
Tiff.initialize({TOTAL_MEMORY: FILE_MAX_LIMIT_BYTES});

@Component({
  selector: 'app-prediction',

  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {
  @ViewChild('inputBarComponent') inputBarComponent: InputBarComponent;
  @ViewChild('resultsComponent') resultsComponent: PredictionResultsComponent;
  @ViewChild('passwordDialog') passwordDialog: DialogComponent;
  @ViewChild('passwordInputElement') passwordInputElement: ElementRef;
  @ViewChild('confirmationDialog') confirmationDialog: DialogComponent;


  file: File;
  fileType: string;
  pages: number;
  prediction: Engine;

  fileState: FileState = FileState.no_file;
  fileIsTooLarge: boolean = false;

  selectedAttribute: QualityAttribute;
  selectedIndex: number = 0;

  password: string;
  isPasswordHidden: boolean = true;
  ocrIndex: boolean = true;

  spinner: boolean = false;
  tick: number = 0;
  timer: Subscription;

  readonly attributes: QualityAttribute[] = qualityAttributes;
  readonly fileStates = FileState;
  private readonly ocrIndexKey: string = 'ocrIndex';
  private readonly docCategoryKey: string = 'docCategory';

  constructor(
    private messageService: MessageService, private qualityService: QualityService) {
  }

  async chooseFile(file: File): Promise<void> {
    this.deleteFile();
    this.file = file;
    this.handleMaxSizeLimit(file);
    await this.detectFileType();
    this.fileState = FileState.chosen;
  }

  handleMaxSizeLimit(file: File): void {
    if (file.size > FILE_MAX_LIMIT_BYTES) {
      this.fileIsTooLarge = true;
      this.messageService.add({
        severity: 'error',
        summary: translate('product.errors.limit')
      });
    }
  }

  async detectFileType(): Promise<void> {
    const fileHeader: string = await getFileHeader(this.file);
    this.fileType = Object.values(DocumentFileType).includes(fileTypeHeaders[fileHeader])
      ? fileTypeHeaders[fileHeader] : 'unsupported';
  }

  predictDocumentQuality(file: File, password?: string): void {
    this.enableLoading();
    const preview: boolean = this.fileType !== DocumentFileType.PDF;
    const ocrIndex: boolean = localStorage.getItem(this.ocrIndexKey) === 'true';
    const docCategory: boolean = localStorage.getItem(this.docCategoryKey) === 'true';
    this.qualityService.getAccessToken().pipe(
      tap((res: Token): void => {
        this.qualityService.getPredictionResults(file, res, preview, ocrIndex, docCategory, password).pipe(
          tap((response: Engine): void => {
            this.prediction = response;
            this.pages = this.prediction.qualities.length;
          }),
          catchError(async (error: HttpErrorResponse): Promise<void> => {
            this.handlePredictionError(error, translate('product.errors.predict'));
          }),
          finalize(() => this.disableLoading()))
          .subscribe();
      }),
      catchError(async () => this.handleAuthorizationError())
    ).subscribe();
  }

  handleAuthorizationError(): void {
    this.disableLoading();
    this.messageService.add({severity: 'error', summary: translate('product.errors.auth')});
  }

  enableLoading(): void {
    this.prediction = null;
    this.spinner = true;
    this.fileState = FileState.uploaded;
    let timer: Observable<number> = TimerObservable.create(0, 1000);
    this.timer = timer.subscribe((second: number) => this.tick = second);
  }

  disableLoading(): void {
    this.spinner = false;
    this.fileState = FileState.predicted;
    this.timer.unsubscribe();
  }

  handlePredictionError(error: HttpErrorResponse, defaultMessage: string): void {
    let errorMessage: string = defaultMessage;
    if (error.error != null) {
      errorMessage = getErrorMessage(error);
      if (error.status == HttpStatusCode.PayloadTooLarge) {
        errorMessage += translate('product.errors.limit');
      }
    }

    this.messageService.add({severity: 'error', summary: errorMessage});
  }


  confirmPassword(password: string): void {
    this.password = password;
    this.calculateDocumentPages(this.file, this.password);
  }

  calculateDocumentPages(file: File, password?: string): void {
    if (isTiff(this.fileType)) {
      this.countTiffPages(file);
    } else if (isPdf(this.fileType)) {
      this.countPDFPages(file, password);
    } else {
      this.predictDocumentQuality(this.file);
    }
  }

  async checkDocumentPassword(file: File): Promise<void> {
    if (isTiff(this.fileType)) {
      await checkFilePasswordProtection(file) ? this.passwordDialog.show() : this.countTiffPages(this.file);
    } else if (isPdf(this.fileType)) {
      await checkPDFPasswordProtection(file) ? this.passwordDialog.show() : this.countPDFPages(this.file);
    } else {
      this.predictDocumentQuality(this.file);
    }
  }

  countTiffPages(file: File) {
    const reader: FileReader = new FileReader();
    const component = this;

    reader.onload = function (): void {
      try {
        let tiff = new Tiff({buffer: this.result});
        component.pages = tiff.countDirectory();
        component.pages > 5 ? component.confirmationDialog.show() : component.predictDocumentQuality(file);
        tiff.close();
      } catch {
        component.onTiffOpenError();
      }
    };

    reader.readAsArrayBuffer(this.file);
  }

  onTiffOpenError(): void {
    this.messageService.add({
      severity: 'error',
      summary: translate('product.errors.tiff')
    });
  }

  countPDFPages(file: File, password?: string): void {
    calculatePDFPages(URL.createObjectURL(file), password)
      .then((pages: number): void => {
        this.pages = !!pages ? pages : 1;
        this.pages > 5 ? this.confirmationDialog.show() : this.predictDocumentQuality(file, password);
        this.password = !!password ? password: null;
      })
      .catch((reason: any): void => this.onPasswordError(reason));
  }

  onPasswordError(reason: any): void {
    const code = reason.code;
    if (supportedPasswordErrorCode.includes(code)) {
      this.messageService.add({
        severity: 'error',
        summary: passwordTranslationMapping[code]
      });
    } else {
      this.messageService.add({severity: 'error', summary: reason.message});
    }
  }

  handleSelectedAttributeFromDatabase(index: number): void {
    this.selectedAttribute = this.attributes[index];
    this.selectedIndex = index;
  }

  deleteFile(): void {
    if (this.file) {
      this.inputBarComponent.uploadComponent.fileInput.file = null;
    }
    this.fileState = FileState.no_file;
    this.fileIsTooLarge = false;
    this.file = null;
    this.fileType = null;
    this.prediction = null;
    this.resultsComponent.clearResultPageParameters();
  }

  clearPasswordForm(): void {
    this.passwordDialog.hide();
    this.passwordInputElement.nativeElement.value = null;
  }
}

