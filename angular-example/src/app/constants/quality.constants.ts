export enum QualityAttribute {
  GOOD_QUALITY = 'good_quality',
  SHARPNESS = 'sharpness',
  SHAPE = 'shape',
  EXPOSURE = 'exposure',
  READABILITY = 'readability'
}

export function getOverallMessageByAttrLangMapping(attr: string): string {
  switch (attr?.toLowerCase()) {
    case QualityAttribute.GOOD_QUALITY:
      return 'product.quality_types.messages.good_quality';
    case QualityAttribute.SHARPNESS:
      return 'product.quality_types.messages.sharpness';
    case QualityAttribute.EXPOSURE:
      return 'product.quality_types.messages.exposure';
    case QualityAttribute.SHAPE:
      return 'product.quality_types.messages.shape';
    case QualityAttribute.READABILITY:
      return 'product.quality_types.messages.readability';
    default:
      return 'empty';
  }
}

export const qualityAttributes: QualityAttribute[] = Object.values(QualityAttribute);
export const FILE_MAX_LIMIT_MB: number = 64;
export const FILE_MAX_LIMIT_BYTES: number = FILE_MAX_LIMIT_MB * 1024 * 1024;
