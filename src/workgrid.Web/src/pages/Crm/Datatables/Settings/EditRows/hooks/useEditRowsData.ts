import { Datatable } from "common/data/Datatable";

/**
 * useEditRowsData — satır düzenleyicinin veri toplama motoru. 
 *  NE YAPAR (özet):
 *  Bir tabloyu düzenlemek için gereken tüm parçaları paralel çeker ve
 *  düzenleyicinin tüketebileceği biçime getirir: kolonlar, satırlar, hücreler,
 *  ilişkili (foreign) tablolar ve onların satır hücreleri.
 *
 *  - cells: columnId → TableCell[] sözlüğüne indirgenir.
 *  - neededTableIds: kolonlardan realTableId'ler toplanıp yalnızca ilişkili
 *      tablolar filtrelenir (gereksiz tablo yüklenmez).
 *  - foreignRows: ilişkili tabloların satırlarından yalnızca ihtiyaç duyulan
 *      foreign kolon hücreleri süzülüp rowId → TableCell[] olarak biriktirilir
 *      (ilişkili değerlerin etiketini çözebilmek için).
 *  - columns/rows tablo-id ile sözlükte tutulur; tüm yükleme/hata bayrakları döner.
 *
 *  İlişki-farkında seçici veri toplama ve foreign satır süzme  
 */
export const useEditRowsData = (_table: Datatable | undefined): any => {
  //  Kolon/satır/hücre/foreign paralel toplama + foreign satır süzme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};