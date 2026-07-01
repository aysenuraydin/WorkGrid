import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";

export interface RulesValidationConfig {
  id?: number;
  isActive?: boolean;
  rule?: ValidationRuleEnum;
  value?: string;
  message?: string;
}