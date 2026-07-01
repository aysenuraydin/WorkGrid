import { dateTypes } from "common/data/dateTypes";
import { FieldTypeEnum } from "common/enums/FieldTypeEnum";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";
import { getValitationType } from "common/utils/getValitationType";

export const useValidationUtils = () => { 

    const getFilteredNewRuleTypes = (colType:InputTypeEnum) => {
        const validationType =  getValitationType(colType)
        
        const commonRules = ["matches", "allowedValues", "unique", "trim"];
        const numericRules = ["integer", "positive", "negative"];
        const textRules = ["length"];

        if (validationType === FieldTypeEnum.number) {
            return [...commonRules, ...numericRules];
        }
        
        return [...commonRules, ...textRules];
    };  

    const getInputTypeByRule = (rule: ValidationRuleEnum | "", columnType?: InputTypeEnum): string => {
        if (!rule) return "text"; 
        
        const isDateType = columnType && dateTypes.includes(columnType);

        // Tarih tiplerinde min/max durumu
        if (isDateType) {
            switch (rule) {
                case ValidationRuleEnum.minLength:
                case ValidationRuleEnum.maxLength:
                case ValidationRuleEnum.length:
                    return "number";
                default:
                    return "text";
            }
        }

        // Genel kurallar
        switch (rule) {
            case ValidationRuleEnum.min:
            case ValidationRuleEnum.max:
            case ValidationRuleEnum.minLength:
            case ValidationRuleEnum.maxLength:
            case ValidationRuleEnum.length:
                return "number";
            default:
                return "text";
        }
    };

    return{ 
        getFilteredNewRuleTypes, 
        getInputTypeByRule
    }
} 