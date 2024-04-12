import {DetailAttribute} from "./detail-attribute";

export interface QualityDetail {
  quality: any;
  attribute: string;
  detailed_attributes: DetailAttribute[];
  additional_remarks: string[];
}
