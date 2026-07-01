import { DEFAULT_RULE_MESSAGES } from "common/config/DEFAULT_RULE_MESSAGES";
import { RulesValidationConfig } from "common/config/RulesValidationConfig";
import { dateTypes } from "common/data/dateTypes";
import { TableColumn } from "common/data/TableColumn";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { PropertyEnum } from "common/enums/PropertyEnum";
import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";


export const getInitialRules = (col: TableColumn): RulesValidationConfig[] => {
    const colName = col.name || "Alan";
    const rulesMap = new Map<ValidationRuleEnum, any>();
    
    col.validationFk?.rules?.forEach(r => {
        if (r.rule) {
            rulesMap.set(r.rule as ValidationRuleEnum, { ...r, origin: 'db' });
        }
    });

    const systemRules = new Set<ValidationRuleEnum>();
    const inputType = col?.type?.toLowerCase();
    const isDateColumn = dateTypes.some(type => type.toLowerCase() === inputType);

    col.dataFk?.forEach((config) => {
        let ruleToMatch: ValidationRuleEnum | null = null;
        switch (config.type) {
            case PropertyEnum.min: ruleToMatch = ValidationRuleEnum.min; break;
            case PropertyEnum.max: ruleToMatch = ValidationRuleEnum.max; break;
            case PropertyEnum.minLength: ruleToMatch = ValidationRuleEnum.minLength; break;
            case PropertyEnum.maxLength: ruleToMatch = ValidationRuleEnum.maxLength; break;
            case PropertyEnum.pattern: ruleToMatch = ValidationRuleEnum.pattern; break;
        }

        if (ruleToMatch) {
            systemRules.add(ruleToMatch);
            const dbRule = rulesMap.get(ruleToMatch);
            
            const isValueChanged = dbRule && dbRule.value !== config.value;
            const finalValue = config.value || (dbRule?.value ?? "");
            
            const finalMessage = (isValueChanged || !dbRule?.message) 
                ? (DEFAULT_RULE_MESSAGES[ruleToMatch]?.(colName, finalValue) ?? "")
                : dbRule.message;

            let activeStatus = dbRule?.isActive ?? true;
            if (isDateColumn && (ruleToMatch === ValidationRuleEnum.min || ruleToMatch === ValidationRuleEnum.max)) {
                activeStatus = false;
            }

            rulesMap.set(ruleToMatch, {
                rule: ruleToMatch,
                value: finalValue,
                isActive: activeStatus,
                message: finalMessage,
                origin: 'system' 
            });
        }
    });

    let typeRule: ValidationRuleEnum | null = null;
    if (inputType === InputTypeEnum.Email.toLowerCase()) typeRule = ValidationRuleEnum.email;
    if (inputType === InputTypeEnum.URL.toLowerCase()) typeRule = ValidationRuleEnum.url;

    if (typeRule) {
        systemRules.add(typeRule);
        const dbRule = rulesMap.get(typeRule);
        rulesMap.set(typeRule, {
            rule: typeRule,
            value: dbRule?.value ?? "",
            isActive: dbRule?.isActive ?? true,  
            message: dbRule?.message || (DEFAULT_RULE_MESSAGES[typeRule]?.(colName) ?? ""),
            origin: 'system'
        });
    }

    col.uiFk?.forEach(ui => {
        const uiType = (ui as any).type?.toLowerCase();
        if (uiType === "required") {
            const ruleToMatch = ValidationRuleEnum.required;
            systemRules.add(ruleToMatch);
            const dbRule = rulesMap.get(ruleToMatch);

            rulesMap.set(ruleToMatch, {
                rule: ruleToMatch,
                value: dbRule?.value ?? "",
                isActive: dbRule?.isActive ?? true,
                message: dbRule?.message || (DEFAULT_RULE_MESSAGES[ruleToMatch]?.(colName) ?? ""),
                origin: 'system'
            });
        }
    });

    const allSystemPossibleRules = [
        ValidationRuleEnum.min, ValidationRuleEnum.max, 
        ValidationRuleEnum.minLength, ValidationRuleEnum.maxLength, 
        ValidationRuleEnum.pattern, ValidationRuleEnum.required,
        ValidationRuleEnum.email, ValidationRuleEnum.url  
    ];

    allSystemPossibleRules.forEach(ruleType => {
        if (rulesMap.has(ruleType) && !systemRules.has(ruleType)) {
            rulesMap.delete(ruleType);
        }
    });

    return Array.from(rulesMap.values());
}; 

