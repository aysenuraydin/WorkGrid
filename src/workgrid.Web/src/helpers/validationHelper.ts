import * as Yup from "yup";
import { TableColumn } from "common/data/TableColumn";
import { InputTypeEnum } from "common/enums/inputTypeEnum";
import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";
import { DEFAULT_RULE_MESSAGES } from "common/config/DEFAULT_RULE_MESSAGES";

export const createDynamicYupSchema = (columns: TableColumn[]) => {
    const fields: any = {};

    const visibleColumns = columns.filter(col => col.modalDesignFk?.isVisible !== false);
    visibleColumns.forEach((col) => {
        const colType = col.type?.toLowerCase();
        
        const isDateRelated = [
            InputTypeEnum.Date.toLowerCase(),
            InputTypeEnum.DatetimeLocal.toLowerCase(),
            InputTypeEnum.Month.toLowerCase(),
            InputTypeEnum.MultipleDate.toLowerCase(),
            InputTypeEnum.MultipleTime.toLowerCase(),
            InputTypeEnum.Quarter .toLowerCase(),
            InputTypeEnum.RangeDate.toLowerCase(),
            InputTypeEnum.RangeDatetimeLocal.toLowerCase(),
            InputTypeEnum.RangeMonth.toLowerCase(),
            InputTypeEnum.RangeQuarter.toLowerCase(),
            InputTypeEnum.RangeWeek.toLowerCase(),
            InputTypeEnum.RangeYear.toLowerCase(),
            InputTypeEnum.Time.toLowerCase(),
            InputTypeEnum.Week.toLowerCase(),
            InputTypeEnum.Year.toLowerCase(),
        ].some(t => colType?.includes(t));

        let validator: any = (
            colType === InputTypeEnum.Number.toLowerCase() ||
            colType === InputTypeEnum.Tel.toLowerCase() ||
            colType === InputTypeEnum.Ratings.toLowerCase() 
        )
            ? Yup.number().typeError(`${col.name} sayı olmalıdır`).nullable()
            : Yup.string().nullable();

        if (col.validationFk && col.validationFk.rules) {
            col.validationFk.rules
                ?.filter(r => r.isActive)
                ?.forEach((ruleObj) => {
                    const { rule, value, message } = ruleObj;

                    const finalMessage = message || (
                        rule && DEFAULT_RULE_MESSAGES[rule] 
                            ? DEFAULT_RULE_MESSAGES[rule](col.name, value) 
                            : `${col.name} geçersiz.`
                    );
                    
                    switch (rule) {
                        case ValidationRuleEnum.required:
                            validator = validator.required(finalMessage);
                            break;

                        case ValidationRuleEnum.min:
                        case ValidationRuleEnum.max:
                            if (!isDateRelated && validator.type === 'number') {
                                validator = validator[rule === ValidationRuleEnum.min ? 'min' : 'max'](Number(value), finalMessage);
                            }
                            break;

                        case ValidationRuleEnum.minLength:
                        case ValidationRuleEnum.maxLength:
                            if (validator.type === 'string') {
                                validator = validator[rule === ValidationRuleEnum.minLength ? 'min' : 'max'](Number(value), finalMessage);
                            }
                            break;

                        case ValidationRuleEnum.integer:
                        case ValidationRuleEnum.positive:
                        case ValidationRuleEnum.negative:
                            if (validator.type === 'number') {
                                if (rule === ValidationRuleEnum.integer) validator = validator.integer(finalMessage);
                                if (rule === ValidationRuleEnum.positive) validator = validator.positive(finalMessage);
                                if (rule === ValidationRuleEnum.negative) validator = validator.negative(finalMessage);
                            }
                            break;

                        case ValidationRuleEnum.email:
                            if (validator.type === 'string') validator = validator.email(finalMessage);
                            break;

                        case ValidationRuleEnum.url:
                            if (validator.type === 'string') validator = validator.url(finalMessage);
                            break;

                        case ValidationRuleEnum.pattern:
                        case ValidationRuleEnum.matches:
                            if (validator.type === 'string') {
                                validator = validator.matches(new RegExp(value || ""), finalMessage);
                            }
                            break;

                        case ValidationRuleEnum.trim:
                            if (validator.type === 'string') validator = validator.trim(finalMessage);
                            break;

                        case ValidationRuleEnum.allowedValues:
                            const vals = value?.split(",") || [];
                            validator = validator.oneOf(vals, finalMessage);
                            break; 
                    }
                });
        }
        fields[col.id] = validator;
    });

    return Yup.object().shape(fields);
};