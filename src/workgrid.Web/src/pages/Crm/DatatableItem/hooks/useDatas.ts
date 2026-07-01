/**
 * useDatas — tekil tablo sayfasının veri projeksiyonu + dinamik CSS motoru.
 *
 *  NE YAPAR (özet):
 *  EAV satırlarını (satır × kolon → hücre) TanStack Table'ın beklediği düz
 *  satır nesnelerine çevirir ve her kolonun kullanıcı-tanımlı stilini o kolona
 *  KAPSAMLANMIŞ (scoped) global CSS olarak üretir.
 *
 *  - tableData / tableDeletedData: her satır için cellsFk değerleri, güvenli
 *      (safeName) kolon anahtarlarıyla düz nesneye yazılır; audit alanları
 *      (createdAt/By, lastModified..., deletedAt/By) korunur.
 *  - dynamicGlobalStyles: kolonun designFk.styles CSS'i, [data-col-id=...]
 *      seçicisiyle otomatik önekelenir (regex ile her seçici kuralın başına
 *      kolon kapsamı eklenir) — böylece bir kolonun stili yalnızca o kolonu
 *      etkiler, sayfanın geri kalanına sızmaz.
 *  - columnLookup: columnId → TableColumn hızlı erişim.
 *
 *  EAV→düz projeksiyon ve kolon-kapsamlı CSS enjeksiyonu  
 */
export const useDatas = (_id: number): {
  dynamicGlobalStyles: string | undefined;
  tableDeletedData: any[];
  tableData: any[];
} => {
  //  EAV→düz veri projeksiyonu + kolon-kapsamlı dinamik CSS enjeksiyonu.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};