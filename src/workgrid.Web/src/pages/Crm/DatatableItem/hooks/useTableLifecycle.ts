import { Datatable } from "common/data/Datatable";

/**
 * useTableLifecycle — tablo sayfasının yaşam döngüsü + kolon JS motoru.
 *
 *  NE YAPAR (özet):
 *  Tablo verisini yükler, çok-sekme yenileme mesajlarını dinler ve her kolonun
 *  kullanıcı-tanımlı özel JavaScript'ini ilgili DOM öğeleri üzerinde çalıştırır.
 *
 *  - Yükleme: kolon/satır/tablo verisi çekilir; tablo state'e yazılır.
 *  - Çok-sekme: BroadcastChannel("table_updates") üzerinden REFRESH_TABLE
 *      mesajları dinlenir (ilgili sorguların tazelenmesi için kanca).
 *  - Kolon JS: designFk.js tanımlı her kolon için, o kolona ait DOM öğeleri
 *      (data-col-id seçicisi) toplanır ve kullanıcı kodu izole bir fonksiyon
 *      içinde (elements, column, allRows argümanlarıyla) try/catch ile
 *      çalıştırılır; hatalar konsola raporlanır, sayfayı düşürmez.
 *
 *  Kolon-scoped kullanıcı JS yürütme ve DOM eşleme  
 */
export const useTableLifecycle = (
  _setTable: React.Dispatch<React.SetStateAction<Datatable | undefined>>,
  _id: number
): void => {
  //  Tablo yükleme + BroadcastChannel yenileme + kolon-scoped kullanıcı JS.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};