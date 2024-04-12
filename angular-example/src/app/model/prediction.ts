import {DocumentCategory} from "./document-category";

export interface Prediction {
  date: Date;
  execution_time: number
  message: string;
  attribute: string;
  quality: number;
  version: number;
  ocr_index?: number;
  document_category?: DocumentCategory;
}

export function getOCRIndexMessageLangMapping(ocrIndex: number): string {
  if (ocrIndex >= 0 && ocrIndex < 50) {
    return 'product.ocr.hardly_legible';
  } else if (ocrIndex >= 50 && ocrIndex < 90) {
    return 'product.ocr.defects';
  } else if (ocrIndex >= 90 && ocrIndex <= 100) {
    return 'product.ocr.legible';
  } else {
    return 'product.ocr.unknown';
  }
}

export function getDocumentCategoryLangMapping(documentCategory: DocumentCategory): string {
  switch (documentCategory) {
    case DocumentCategory.CMR:
      return 'product.document_category.cmr';
    case DocumentCategory.INVOICE:
      return 'product.document_category.invoice';
    case DocumentCategory.DELIVERY_NOTE:
      return 'product.document_category.delivery_note';
    case DocumentCategory.OCP_OCS:
      return 'product.document_category.ocp_ocs';
    case DocumentCategory.PAYMENT_CONFIRMATION:
      return 'product.document_category.payment_confirmation';
    case DocumentCategory.AGREEMENT:
      return 'product.document_category.agreement';
    case DocumentCategory.UNKNOWN:
      return 'product.document_category.unknown';
    case DocumentCategory.UNABLE_TO_CLASSIFY:
      return 'product.document_category.unable_to_classify';
  }
}
