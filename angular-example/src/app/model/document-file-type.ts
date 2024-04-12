export enum DocumentFileType {
  PDF = 'application/pdf',
  TIFF = 'image/tiff',
  TIF = 'image/tif',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
}

export const TIFF_TYPES: string[] = [DocumentFileType.TIF, DocumentFileType.TIFF];

export function isTiff(extension: string): boolean {
  if (!extension) {
    return false;
  }
  return TIFF_TYPES.includes(extension.toLowerCase());
}

export function isPdf(extension: string): boolean {
  if (!extension) {
    return false;
  }
  return extension == DocumentFileType.PDF;
}
