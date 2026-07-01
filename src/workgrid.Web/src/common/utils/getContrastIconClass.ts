/**
 * Verilen Hex renginin koyu mu açık mı olduğunu hesaplar.
 * Arka plan KOYU ise 'text-white' (açık renk ikon),
 * Arka plan AÇIK ise 'text-dark' veya 'text-primary' (koyu renk ikon) döner.
 */
export const getContrastIconClass = (hexColor: string | undefined): string => {
  if (!hexColor || typeof hexColor !== "string") return "text-primary";
  
  // Başındaki # işaretini temizle
  const hex = hexColor.replace("#", "");
  
  // Eğer kısa hex koduysa (#fff gibi) uzun formata çevir (#ffffff)
  const fullHex = hex.length === 3 
    ? hex.split("").map(char => char + char).join("") 
    : hex;
    
  // R, G, B değerlerini sayıya dönüştür
  const r = parseInt(fullHex.substr(0, 2), 16);
  const g = parseInt(fullHex.substr(2, 2), 16);
  const b = parseInt(fullHex.substr(4, 2), 16);
  
  // YIQ Parlaklık Formülü (Dünya standardıdır, insan gözünün renk algısını temel alır)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  // yiq skoru 0 (en koyu) ile 255 (en açık) arasındadır.
  // Eşik değeri 128'dir. 128'den büyükse renk AÇIKTIR -> Koyu ikon gerekir.
  return yiq >= 128 ? "text-dark" : "text-white";
};