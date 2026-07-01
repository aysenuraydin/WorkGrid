import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";

export const RULE_CONFIG: Record<ValidationRuleEnum, {
    hasValue: boolean;
    hasMessage: boolean;
    hasIsActive: boolean;
}> = {
    [ValidationRuleEnum.required]: { hasValue: false, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.email]: { hasValue: false, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.url]: { hasValue: false, hasMessage: true, hasIsActive: false},

    [ValidationRuleEnum.min]: { hasValue: true, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.max]: { hasValue: true, hasMessage: true, hasIsActive: false},

    [ValidationRuleEnum.minLength]: { hasValue: true, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.maxLength]: { hasValue: true, hasMessage: true, hasIsActive: false},

    [ValidationRuleEnum.matches]: { hasValue: true, hasMessage: true, hasIsActive: false},

    [ValidationRuleEnum.allowedValues]: { hasValue: true, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.unique]: { hasValue: false, hasMessage: true, hasIsActive: false},

    [ValidationRuleEnum.integer]: { hasValue: false, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.positive]: { hasValue: false, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.negative]: { hasValue: false, hasMessage: true, hasIsActive: false},

    [ValidationRuleEnum.length]: { hasValue: true, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.pattern]: { hasValue: true, hasMessage: true, hasIsActive: false},
    [ValidationRuleEnum.trim]: { hasValue: false, hasMessage: false, hasIsActive: false },
};