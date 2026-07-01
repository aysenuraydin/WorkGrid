import { FieldTypeEnum } from "common/enums/FieldTypeEnum";
import { RulesValidationConfig } from "./RulesValidationConfig";

export interface ColumnValidationConfig {
  id: number;
  type: FieldTypeEnum;
  rules: RulesValidationConfig[];
}