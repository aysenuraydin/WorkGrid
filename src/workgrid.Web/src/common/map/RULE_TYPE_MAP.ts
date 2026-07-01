import { FieldTypeEnum } from "common/enums/FieldTypeEnum";
import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";

export const RULE_TYPE_MAP: Record<ValidationRuleEnum, FieldTypeEnum[]> = {
    [ValidationRuleEnum.required]: [
        FieldTypeEnum.text,
        FieldTypeEnum.number,
        FieldTypeEnum.boolean,
        FieldTypeEnum.date,
    ],

    [ValidationRuleEnum.email]: [FieldTypeEnum.text],
    [ValidationRuleEnum.url]: [FieldTypeEnum.text],

    [ValidationRuleEnum.min]: [FieldTypeEnum.number, FieldTypeEnum.date, FieldTypeEnum.array],
    [ValidationRuleEnum.max]: [FieldTypeEnum.number, FieldTypeEnum.date, FieldTypeEnum.array],

    [ValidationRuleEnum.minLength]: [FieldTypeEnum.text, FieldTypeEnum.array],
    [ValidationRuleEnum.maxLength]: [FieldTypeEnum.text, FieldTypeEnum.array],

    [ValidationRuleEnum.matches]: [FieldTypeEnum.text],
    [ValidationRuleEnum.allowedValues]: [
        FieldTypeEnum.text,
        FieldTypeEnum.number,
        FieldTypeEnum.array,
        FieldTypeEnum.boolean,
    ],

    [ValidationRuleEnum.unique]: [
        FieldTypeEnum.text,
        FieldTypeEnum.number,
    ],

    [ValidationRuleEnum.integer]: [FieldTypeEnum.number],
    [ValidationRuleEnum.positive]: [FieldTypeEnum.number],
    [ValidationRuleEnum.negative]: [FieldTypeEnum.number],

    [ValidationRuleEnum.pattern]: [FieldTypeEnum.text],
    [ValidationRuleEnum.trim]: [FieldTypeEnum.text],
    [ValidationRuleEnum.length]: [FieldTypeEnum.text, FieldTypeEnum.array],
};
