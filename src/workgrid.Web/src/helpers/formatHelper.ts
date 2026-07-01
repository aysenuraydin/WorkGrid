import { TableColumn } from "common/data/TableColumn"; 

export const InputFormatHelper = { 
    applyMask: (value: string = "", mask: string = "") => {
        if (!mask) return value;
        
        const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
        let maskedValue = "";
        let valPtr = 0;

        for (let i = 0; i < mask.length && valPtr < cleanValue.length; i++) {
            const m = mask[i];
            if (m === "#") {
                maskedValue += cleanValue[valPtr];
                valPtr++;
            } else {
                maskedValue += m;
                
                if (cleanValue[valPtr] === m) valPtr++;
            }
        }
        return maskedValue;
    },

    // B. SAYISAL FORMATLAR (Currency, Decimal, Percent, Integer)
    getNumericProps: (format: string) => {
        const isCurrency = format.startsWith("currency");
        const isPercent = format.startsWith("percent");
        const isDecimal = format.startsWith("decimal");
        const isInteger = format === "integer";

        // Ondalık hassasiyetini çöz (Örn: decimal:4 -> 4)
        const precision = format.includes(":") 
            ? parseInt(format.split(":")[1]) 
            : (isDecimal || isPercent ? 2 : 0);

        const locale = format.includes("usd") ? "en-US" : (format.includes("eur") ? "de-DE" : "tr-TR");
        const currency = format.includes("usd") ? "USD" : (format.includes("eur") ? "EUR" : "TRY");

        return {
            precision: isInteger ? 0 : precision,
            formatter: (value: any) => {
                if (value === null || value === undefined || value === "") return "";
                
                if (isCurrency) {
                    return new Intl.NumberFormat(locale, {
                        style: "currency",
                        currency: currency,
                        minimumFractionDigits: precision,
                    }).format(value);
                }
                
                if (isPercent) return `% ${value}`;
                
                return value;
            },
            parser: (value: any) => {
                // Sadece sayı, nokta ve eksi işaretini bırak
                let parsed = value.replace(/[^\d.-]/g, "");
                if (locale === "tr-TR") parsed = parsed.replace(",", ".");
                return parsed;
            }
        };
    },

    // C. REGEX DOĞRULAMA (RegexList için)
    // Bu metodu onBlur veya form submit öncesi çağırabilirsin
    isValidRegex: (value: string, pattern: string): boolean => {
        if (!pattern || !value) return true;
        try {
            // JavaScript içinde kullanırken çift backslash (\\d) olayına dikkat!
            const regex = new RegExp(pattern);
            return regex.test(value);
        } catch (e) {
            console.error("Geçersiz Regex Deseni:", pattern);
            return false;
        }
    },

    // D. FORMAT EŞLEŞTİRME VE MASK ÇÖZÜMLEME
    getMaskByFormat: (format: string, customMask?: string): string => {
        const staticMasks: Record<string, string> = {
            phone: "(###) ### ## ##",
            "phone:tr": "+90 (###) ### ## ##",
            "phone:us": "(###) ###-####",
            iban: "TR## #### #### #### #### #### ##",
            creditcard: "#### #### #### ####",
            ssn: "###-##-####",
        };
        
        // Eğer format "custom" ise, maskList'ten gelen değeri (KOD-##### gibi) # işaretine çevirir
        if (format === "custom" && customMask) {
            // Sayıları ve harfleri # (placeholder) olarak işaretle, sabitleri koru
            return customMask.replace(/[A-Z0-9]/g, "#");
        }
        
        return staticMasks[format] || "";
    },

    // E. DATE/TIME FORMATLARI (Görünüm ve Kayıt için)
    getDateFormat: (format: string) => {
        const dateFormats: Record<string, string> = {
            "date": "YYYY-MM-DD",
            "datetime-local": "YYYY-MM-DD HH:mm",
            "time": "HH:mm",
        };
        return dateFormats[format] || "YYYY-MM-DD";
    },

    formatValue: (value: any, type: string, formatStr: string) => {
        if (value === null || value === undefined) return "";
        const strValue = String(value);
        
        // 1. Formatı parçala: "custom,*,KOD-#####" -> ["custom", "*", "KOD-#####"]
        const parts = formatStr ? formatStr.split(",") : [];
        const mainFormat = parts[0]?.trim(); // "custom", "regex", "currency:usd"
        const rule = parts[parts.length - 1]?.trim(); // "KOD-#####", "^TR:\\d{5}$"

        // 2. Sayısal kontrol (InputNumber için)
        if (type?.toLowerCase().includes("number")) return value;

        // 3. MASKELİ GİRİŞLER
        // Eğer format "custom" ise veya phone, iban gibi bilinen bir maskeyse
        const staticMasks: any = {
            "phone": "(###) ### ## ##",
            "iban": "TR## #### #### #### #### #### ##"
        };

        if (mainFormat === "custom" && rule) {
            const dynamicMask = rule.replace(/[a-zA-Z0-9]/g, "#");
            return InputFormatHelper.applyMask(strValue, dynamicMask);
        }

        if (staticMasks[mainFormat]) {
            return InputFormatHelper.applyMask(strValue, staticMasks[mainFormat]);
        }

        // 4. REGEX (Yazarken kısıtlama yapmak risklidir, genellikle onBlur'da validate edilir)
        // Ama basit karakter engelleme istersen buraya eklenebilir.

        return value;
    }
};


export const formatFormula = (functionText:string, columns:TableColumn[]) => {
    if (!functionText) return "";
    return functionText.replace(/\{\{(\d+)\}\}/g, (match, id) => {
        const column = columns.find((c:any) => String(c.id) === String(id));
        return column ? `@${column.name}` : `@Unknown`;
    });
};
