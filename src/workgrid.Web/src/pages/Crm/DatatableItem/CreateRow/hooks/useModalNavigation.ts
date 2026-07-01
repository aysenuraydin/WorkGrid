import { DataType } from "common/enums/DataType";
import { Datatable } from "common/data/Datatable";

/**
 * useModalNavigation — satır modalının boyuta göre yönlendirme davranışı.
 *
 *  NE YAPAR (özet):
 *  Bir satır oluştur/düzenle modalı açıldığında, tablonun modalSize ayarına
 *  göre nereye gidileceğini belirler:
 *   - Blank  → hedef URL yeni sekmede açılır, modal kapatılır.
 *   - Overlay→ mevcut rota hedef URL ile (replace) değiştirilir.
 *   - diğer  → normal modal (yönlendirme yok).
 *  Hedef URL, tablo id + tip (create/edit) + rowId + size'dan kurulur.
 *
 *  Boyut-duyarlı modal↔rota köprüsü  
 */
export const useModalNavigation = (
  _rowId: number,
  _modal: boolean,
  _table: Datatable | undefined,
  _modalType: DataType | undefined,
  _setModal?: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  //  Modal boyutuna göre yeni-sekme / overlay-route / modal yönlendirme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};