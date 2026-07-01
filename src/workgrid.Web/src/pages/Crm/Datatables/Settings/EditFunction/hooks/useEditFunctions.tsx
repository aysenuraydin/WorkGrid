/**
 * useEditFunctions — kolon "hesaplanan alan" (formül) dili motoru.
 *
 *  NE YAPAR (özet):
 *  Her kolona, diğer kolonlara referans verebilen bir fonksiyon/formül metni
 *  atanmasını sağlar (ör. bir toplam ya da ifade). İnsan-okunur biçim ile
 *  backend'de saklanan biçim arasında ÇİFT YÖNLÜ çeviri yapar ve düzenleme
 *  sırasında bağlama duyarlı otomatik tamamlama sunar.
 *
 *  - @kolonAdı  ⇄  {{kolonId}} :
 *      replaceColumnNamesWithIds  → kaydederken adları id'lere çevirir
 *      replaceColumnIdsWithNames  → yüklerken id'leri adlara çevirir
 *      (böylece kolon yeniden adlandırılınca formüller bozulmaz).
 *  - Autocomplete: "eval" modunda kolon adları (@...), aksi halde hazır
 *      fonksiyon listesi (evalList) önerilir; son kelime tamamlanır.
 *  - Kaydetme: yalnızca changedMap'te işaretli (değişmiş) kolonlar payload'a
 *      girer; boş metin null'a normalize edilir; bulk mutation'la yazılır.
 *
 *  Ad↔id çift yönlü referans çevirisi (yeniden-adlandırmaya dayanıklı formül
 *  saklama)  
 */
export const useEditFunctions = (_id: number): any => {
  //  @ad ↔ {{id}} çift yönlü formül çevirisi + bağlam-duyarlı autocomplete.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};