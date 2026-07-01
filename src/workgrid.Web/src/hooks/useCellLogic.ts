import { AttributeEnum } from 'common/enums/AttributeEnum';
import { InputMaskFormat } from 'common/enums/InputMaskFormat';
import { PropertyEnum } from 'common/enums/PropertyEnum';
import { useMemo } from 'react';
export interface IInputProps {
    placeholder?: string;
    defaultValue?: string | number | boolean | any;
    disabled?: boolean;
    readOnly?: boolean;
    hidden?: boolean;
    helpText?: string;
    prefix?: string;
    suffix?: string;
    size?: "sm" | "lg";  
    maxLength?: string | number;
    minLength?: string | number;
    min?: string | number;
    max?: string | number;
    pattern?: string;

    multiple?: boolean;
    cols?: string | number;
    rows?: string | number;
    step?: string | number;
    accept?: string;
    options?: string;  
    format?: string;
    rangeLimit?: string | number;
    maxSizeMB?: string | number;
    required?: boolean;
    autoFocus?: boolean;
    label?: string;
}
export const useCellLogic = (col: any, cellConfigs: any) => {

    const inputRule: InputMaskFormat = useMemo(() => {
        const fmt = (cellConfigs[AttributeEnum.format] || "").toLowerCase();
        if (!fmt) return { type: "decimal", decimals: 2 }; // fallback

        const parts = fmt.split(",*,"); // custom ve regex formatları için
        const main = parts[0]?.trim();
        const rulePart = parts[parts.length - 1]?.trim();

        switch (true) {
            case main?.startsWith("currency"):
                const currency = main.includes(":") ? (main.split(":")[1].toUpperCase() as "TRY"|"USD"|"EUR") : "TRY";
                return { type: "currency", currency, decimals: 2 };

            case main?.startsWith("decimal"):
                const decimals = main.includes(":") ? parseInt(main.split(":")[1]) : 2;
                return { type: "decimal", decimals };

            case main?.startsWith("percent"):
                const pDecimals = main.includes(":") ? parseInt(main.split(":")[1]) : 2;
                return { type: "percent", decimals: pDecimals };
            
            case main === "ssn":
                return { type: "ssn" };

            case main === "integer":
                return { type: "integer" };

            case main?.startsWith("phone"):
                return { type: "phone", country: main.includes("us") ? "us" : "tr" };

            case main === "iban":
                return { type: "iban" };

            case main === "creditcard":
                return { type: "creditcard" };

            case main === "custom":
                return { type: "custom", mask: rulePart || "####" };  

            default:
                return { type: "decimal", decimals: 2 };
        }
    }, [cellConfigs])

    const inputProps : IInputProps = {
        // PROPERTY_CONFIG'den gelenler
        placeholder: cellConfigs[PropertyEnum.placeholder],
        defaultValue: cellConfigs[PropertyEnum.defaultValue],
        disabled: cellConfigs[PropertyEnum.disabled] ==="true",
        readOnly: cellConfigs[PropertyEnum.readonly] ==="true",
        hidden: cellConfigs[PropertyEnum.hidden] ==="true",
        helpText: cellConfigs[PropertyEnum.helpText],
        prefix: cellConfigs[PropertyEnum.prefix],
        suffix: cellConfigs[PropertyEnum.suffix],
        size: cellConfigs[PropertyEnum.size] === "small" 
                ? "sm" 
                : cellConfigs[PropertyEnum.size] === "large" 
                    ? "lg" 
                    : undefined,
        maxLength: cellConfigs[PropertyEnum.maxLength],
        minLength: cellConfigs[PropertyEnum.minLength],
        min: cellConfigs[PropertyEnum.min],
        max: cellConfigs[PropertyEnum.max],
        pattern: cellConfigs[PropertyEnum.pattern],
        
        // ATTRIBUTE_CONFIG'den gelenler
        multiple: cellConfigs[AttributeEnum.multiple] ==="true",
        cols: cellConfigs[AttributeEnum.cols],
        rows: cellConfigs[AttributeEnum.rows],
        step: cellConfigs[AttributeEnum.step],
        accept: cellConfigs[AttributeEnum.accept],
        options: cellConfigs[AttributeEnum.options],
        format: cellConfigs[AttributeEnum.format],
        rangeLimit: cellConfigs[AttributeEnum.rangeLimit],
        maxSizeMB: cellConfigs[AttributeEnum.maxSizeMB], 
        required: cellConfigs[AttributeEnum.required] === "true",
        autoFocus: cellConfigs[AttributeEnum.autoFocus] === "true",
        label: cellConfigs[AttributeEnum.label],
    };  

    return { inputRule, inputProps };
};