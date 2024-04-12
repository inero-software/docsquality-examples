import {QualityDetail} from "./quality-detail";
import {DocumentCategory} from "./document-category";

export interface Quality {
  id: number;
  details: QualityDetail[];
  message: string;
  attribute: string;
  preview?: string;
  quality: number;
  ocr_index?: number;
  page: number;
  category: DocumentCategory;
}
