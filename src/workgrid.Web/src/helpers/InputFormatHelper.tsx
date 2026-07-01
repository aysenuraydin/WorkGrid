import { InputMaskFormat } from 'common/enums/InputMaskFormat';
import { IExtraProps } from 'pages/Crm/DatatableItem/RenderCellInput';
import { PatternFormat, NumericFormat } from 'react-number-format';
import { Input, InputProps } from "reactstrap";

type Props = InputProps & {
    value: string | number;
    rule: InputMaskFormat;
    onChange: (val: string) => void;
};

export function FormatInput({ value, rule, onChange, ...extra }: Props) {
    
    const patterns: Record<string, string> = {
        phone: rule.type === "phone" && rule.country === "us" ? "(###) ###-####" : "+90 ### ### ## ##",
        iban: "TR## #### #### #### #### #### ##",
        creditcard: "#### #### #### ####",
        ssn: "###-##-####",
    };

    if (rule.type === "custom" || patterns[rule.type]) {
        return (
            <PatternFormat
                value={value}
                format={rule.type === "custom" ? rule.mask : patterns[rule.type]}
                customInput={Input}
                onValueChange={v => onChange(rule.type === "custom" ? v.formattedValue : v.value)}
                className={extra.className}
                placeholder={extra.placeholder}
                disabled={extra.disabled}
                readOnly={extra.readOnly}
                invalid={extra.invalid}
                formatCharacters={rule.type === "custom" ? {
                    '#': { pattern: /[0-9]/ },
                    'A': { pattern: /[a-zA-Z]/ },
                    '*': { pattern: /[a-zA-Z0-9]/ }
                } : undefined}
            />
        );
    }

    if (["currency", "decimal", "integer", "percent"].includes(rule.type)) {
        const isUsd = rule.type === "currency" && rule.currency === "USD";
        
        return (
            <NumericFormat
                value={value}
                customInput={Input}
                thousandSeparator={isUsd ? "," : "."}
                decimalSeparator={isUsd ? "." : ","}
                decimalScale={rule.type === "integer" ? 0 : (rule as any).decimals ?? 2}
                fixedDecimalScale={rule.type !== "integer"}
                prefix={rule.type === "currency" ? (isUsd ? "$ " : rule.currency === "EUR" ? "€ " : "₺ ") : ""}
                suffix={rule.type === "percent" ? " %" : ""}
                onValueChange={v => onChange(v.value)}
                className={extra.className}
                placeholder={extra.placeholder}
                disabled={extra.disabled}
                readOnly={extra.readOnly}
                invalid={extra.invalid}
            />
        );
    }

    /* ================= DEFAULT FALLBACK ================= */
    return (
        <Input
            {...extra}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type="text"
        />
    );
} 

export const InputFormatHelper = { 

    renderInput: (type: string, format: string, value: any,  extra: IExtraProps | any,  onValueChange: (val: any) => void) => {
        const formatAttr = format || "";
        const parts = formatAttr.split(",");
        const mainFormat = parts[0]?.trim(); 
        const rule = parts[parts.length - 1]?.trim();

        // 1. CUSTOM MASK DURUMU
        if (mainFormat === "custom") {
            return (
                <PatternFormat
                    {...extra}
                    format={rule}
                    value={value}
                    customInput={Input}
                    type="text"
                    onValueChange={(values) => onValueChange(values.formattedValue)}
                />
            );
        }

        if (mainFormat.startsWith("currency") || mainFormat.startsWith("decimal") || mainFormat.startsWith("percent")) {
            const isUsd = mainFormat.includes("usd");
            const isEur = mainFormat.includes("eur");
            const precision = mainFormat.includes(":") ? parseInt(mainFormat.split(":")[1]) : 2;

            return (
                <NumericFormat
                    {...extra}
                    value={value}
                    customInput={Input}
                    thousandSeparator={isUsd ? "," : "."}
                    decimalSeparator={isUsd ? "." : ","}
                    prefix={isUsd ? "$ " : isEur ? "€ " : mainFormat.startsWith("currency") ? "₺ " : ""}
                    suffix={mainFormat.startsWith("percent") ? " %" : ""}
                    decimalScale={precision}
                    onValueChange={(values) => onValueChange(values.value)}  
                />
            );
        }

        return (
            <Input
                {...extra}
                type={type}
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
            />
        );
    }
};