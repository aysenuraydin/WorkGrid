export const INPUT_FORMAT_ENUM = [
    "",
    "currency:usd",      // $1,234.56
    "currency:eur",      // €1.234,56
    "currency:try",      // ₺1.234,56
 
    "decimal:2",         // 1234.57
    "decimal:4",         // 1234.5678

    "percent",           // %12.5
    "percent:2",         // %12.50

    "integer",           // 1234
 
    "phone:tr",          // +90 (###) ### ## ##
    "phone:us",          // (###) ###-####

    "iban",              // TR12 3456 7890 1234 5678 9012 34
    "creditcard",        // #### #### #### ####
    "ssn",               // ###-##-#### 
    
    "custom",            // kullanıcı mask girer 
] as const;


