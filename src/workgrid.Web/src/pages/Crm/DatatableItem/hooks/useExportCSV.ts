/**
 * useExportCSV — dinamik tablonun CSV dışa aktarma motoru.
 *
 *  NE YAPAR (özet):
 *  EAV yapısındaki satır/hücre verisini, ilişkili (ayna) kolonların etiketleri
 *  çözülmüş biçimde CSV'ye dönüştürüp indirir.
 *
 *  - Kolonlar tableOrder'a göre sıralanır; başlık satırında ayna kolonlar için
 *      "<ilişkili tablo adı> <kolon adı>" biçimi kullanılır (büyük harf).
 *  - Her hücre: normal kolonlarda değer CSV-escape edilir; ayna kolonlarda
 *      hücredeki id listesi, hedef tablonun hücrelerinden gerçek değerlere
 *      (label) çevrilip birleştirilir.
 *  - Sonuç Blob olarak oluşturulup tablo adıyla indirilir.
 *
 *  Ayna kolon id→label çözümü ve güvenli CSV serileştirme bu dosyanın özgün
 *  emeğidir; gizlenmiştir.
 *
 * Kaynak kodu talep üzerine paylaşılabilir.
 * Source available on request.
 */
export const useExportCSV = (_id: number): {
  isExportCSV: boolean;
  exportToCsv: () => void;
  setIsExportCSV: React.Dispatch<React.SetStateAction<boolean>>;
} => {
  //  EAV→CSV + ayna kolon id→label çözümü + CSV-escape serileştirme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};