import { ValidationRuleEnum } from "common/enums/ValidationRuleEnum";

export const DEFAULT_RULE_MESSAGES: Record<ValidationRuleEnum, (colName: string, value?: string) => string> = {
    required: (colName) => `${colName} alanı zorunludur.`,
    email: (colName) => `${colName} geçerli bir email adresi olmalıdır.`,
    url: (colName) => `${colName} geçerli bir URL olmalıdır.`,
    min: (colName, value) => `${colName} için minimum ${value ?? ''} değeri sağlanmalıdır.`,
    max: (colName, value) => `${colName} için maksimum ${value ?? ''} değeri aşılmamalıdır.`,
    minLength: (colName, value) => `${colName} minimum ${value ?? ''} uzunlukta olmalıdır.`,
    maxLength: (colName, value) => `${colName} maksimum ${value ?? ''} uzunlukta olmalıdır.`,
    matches: (colName, value) => `${colName} ${value ?? ''} ile eşleşmelidir.`,
    allowedValues: (colName, value) => `${colName} sadece şu değerleri alabilir: ${value ?? ''}.`,
    unique: (colName) => `${colName} benzersiz olmalıdır.`,
    integer: (colName) => `${colName} bir tam sayı olmalıdır.`,
    positive: (colName) => `${colName} pozitif bir sayı olmalıdır.`,
    negative: (colName) => `${colName} negatif bir sayı olmalıdır.`,
    length: (colName, value) => `${colName} belirli bir uzunlukta olmalıdır. (${value ?? ''})`,
    pattern: (colName, value) => `${colName} şu desenle eşleşmelidir: ${value ?? ''}.`,
    trim: (colName) => `${colName} boşluk içermemelidir.`,
};