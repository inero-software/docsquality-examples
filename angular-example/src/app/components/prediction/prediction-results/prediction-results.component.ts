import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Engine} from "../../../model/engine";
import {QualityDetail} from "../../../model/quality-detail";
import {getDocumentCategoryLangMapping, getOCRIndexMessageLangMapping, Prediction} from "../../../model/prediction";
import {Quality} from "../../../model/quality";
import {qualityColorRanges} from "../../../constants/quality-color-range";
import {getOverallMessageByAttrLangMapping, QualityAttribute} from "../../../constants/quality.constants";
import {DocumentFileType} from "../../../model/document-file-type";
import {TranslocoService} from "@ngneat/transloco";

@Component({
  selector: 'app-prediction-results',
  templateUrl: './prediction-results.component.html',
  styleUrls: ['./prediction-results.component.css']
})
export class PredictionResultsComponent implements OnChanges {

  @Input() set prediction(response: Engine) {
    if (response) {
      this._response = response;
      this._prediction = response?.prediction;
      this._qualities = response?.qualities;
      this.src = null;
    }
  }

  @Input() fileIsUploaded: boolean;
  @Input() file: File;
  @Input() fileType: string;
  @Input() password: string;
  @Output() preview: EventEmitter<boolean> = new EventEmitter<boolean>();

  worstDetails: QualityDetail[] = [];

  _response: Engine;
  _prediction: Prediction;
  _qualities: Quality[];

  src: string;
  selectedPageNo: number;

  showPreview: boolean;
  page: number;
  isHidedPages: boolean = true;
  activeState: boolean[] = [];

  protected readonly DocumentFileType = DocumentFileType;
  protected readonly getOCRIndexMessage = getOCRIndexMessageLangMapping;
  protected readonly getOverallMessageByAttrLangMapping = getOverallMessageByAttrLangMapping;
  protected readonly getDocumentCategoryLangMapping = getDocumentCategoryLangMapping;

  constructor(private translocoService: TranslocoService) {
  }

  get activeLang(): string {
    return this.translocoService.getActiveLang();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.prediction && this._prediction && this._qualities) {
      this.processQualities();
    }
  }

  private processQualities(): void {
    this._qualities.forEach((quality: Quality): void => {
      const pageNumber: number = quality.page - 1;
      let detail: boolean = quality.details.some((detail: QualityDetail): boolean => detail.additional_remarks.length > 0);
      this.activateTab(pageNumber, quality.quality < 50 || detail);
      this.appendWorstDetails(quality, pageNumber);
    });
  }

  getBackgroundColorType(quality: number): string {
    return qualityColorRanges.find(type => this.isValueInRange(quality, type.startRange, type.endRange)).color;
  }

  getKnobClassNameType(quality: number): string {
    return qualityColorRanges.find(type => this.isValueInRange(quality, type.startRange, type.endRange)).className;
  }

  activateTab(index: number, state: boolean): void {
    this.activeState[index] = state;
  }

  hidePages(): void {
    this.activeState.every(value => value == false) ? this.activeState.forEach((_: boolean, index: number): void => {
        this.activeState[index] = true;
      }
    ) : this.activeState.forEach((_: boolean, index: number): void => {
        this.activeState[index] = false;
      }
    );
    this.isHidedPages = !this.isHidedPages;
  }

  appendWorstDetails(quality: Quality, pageNumber: number): void {
    const worstDetail: QualityDetail = quality.details
      .find((value: QualityDetail) => this._prediction.attribute !== QualityAttribute.GOOD_QUALITY && value.attribute === quality.attribute);
    this.worstDetails.splice(pageNumber, 0, worstDetail);
  };

  public clearResultPageParameters(): void {
    this.prediction = null;
    this._prediction = null;
    this._qualities = null;
  }

  assignSelectedPageUrl(quality: Quality): void {
    const preview: string = quality.preview;
    if (preview) {
      this.src = preview;
    } else {
      this.selectedPageNo = quality.page;
      this.src = URL.createObjectURL(this.file);
    }
  }

  isValueInRange(value: number, startRange: number, endRange: number): boolean {
    return (value >= startRange && value <= endRange);
  }
}
