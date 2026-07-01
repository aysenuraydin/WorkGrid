// utils/enumHelper.ts

/**
 * Enum içindeki değerleri dizi olarak döner.
 * @param enumObj Enum nesnesi
 * @returns Enum değerlerinden oluşan bir string dizisi
 */
export function getEnumValues<T extends object>(enumObj: T): string[] {
  return Object.values(enumObj);
}