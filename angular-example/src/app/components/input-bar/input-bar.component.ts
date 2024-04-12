import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MessageService} from "primeng/api";
import {UploadFormComponent} from "../../commons/upload-form/upload-form.component";
import {translate} from "@ngneat/transloco";


@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.css']
})
export class InputBarComponent implements OnInit {
  @ViewChild('uploadComponent') uploadComponent: UploadFormComponent;

  @Input() fileIsChosen: boolean;
  @Input() fileIsTooLarge: boolean;
  @Input() fileDropDisabled: boolean;
  @Input() predictionDisabled: boolean;
  @Input() file: File;

  @Output() uploadCallback: EventEmitter<File> = new EventEmitter<File>();
  @Output() predictCallback: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteCallback: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectAttributeCallback: EventEmitter<number> = new EventEmitter<number>();

  ocrIndexEnabled: boolean = true;
  documentCategoryEnabled: boolean = true;

  private readonly ocrIndexKey: string = 'ocrIndex';
  private readonly docCategoryKey: string = 'docCategory';


  constructor(private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.getOCRIndexSelectionFromStorage();
    this.getDocTypeSelectionFromStorage();
  }

  setInputFile(file: File): void {
    this.uploadComponent.fileInput.file = file;
  }

  getOCRIndexSelectionFromStorage(): void {
    this.ocrIndexEnabled = localStorage.getItem(this.ocrIndexKey) === 'true';
  }

  getDocTypeSelectionFromStorage(): void {
    this.documentCategoryEnabled = localStorage.getItem(this.docCategoryKey) === 'true';
  }


  saveOCRIndexSelectionInStorage(event: any): void {
    localStorage.setItem(this.ocrIndexKey, String(event.checked));
  }

  saveDocTypeSelectionInStorage(event: any): void {
    localStorage.setItem(this.docCategoryKey, String(event.checked));
  }

  onCompressionUnpackError(): void {
    this.messageService.add({
      severity: 'error',
      summary: translate('product.compression_error'),
    });
  }
}
