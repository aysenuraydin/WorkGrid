export type InputMaskFormat =
  | { type: "currency"; currency: "TRY" | "USD" | "EUR"; decimals?: number }
  | { type: "decimal"; decimals?: number }
  | { type: "percent"; decimals?: number } // Yeni eklendi
  | { type: "integer" }
  | { type: "phone"; country?: "tr" | "us" }
  | { type: "iban" }
  | { type: "creditcard" }
  | { type: "ssn" } // Yeni eklendi
  | { type: "custom"; mask: string };