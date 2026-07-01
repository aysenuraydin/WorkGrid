import { ActiveTab, TabItem } from "./useTabState";
import { Datatable } from "common/data/Datatable";

interface UseDatatableActionsParams {
  activeTab: ActiveTab;
  table: Datatable | undefined;
  setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>;
}

export interface DatatableActionsApi {
  isTableMultiDeleteButton: boolean;
  setIsTableMultiDeleteButton: React.Dispatch<React.SetStateAction<boolean>>;
  isRowMultiDeleteButton: boolean;
  setIsRowMultiDeleteButton: React.Dispatch<React.SetStateAction<boolean>>;
  deleteModalMulti: boolean;
  setTableDeleteModalMulti: React.Dispatch<React.SetStateAction<boolean>>;
  checkedAll: () => void;
  deleteCheckbox: () => void;
  deleteCheckedRow: () => Promise<void>;
  deleteTableMultiple: () => void;
  deleteDatatableById: (tableId: number) => Promise<void>;
  backToDelete: (tableId: number) => Promise<void>;
  hardDelete: (tableId: number) => Promise<void>;
}

/**
 * useDatatableActions — tablo/satır silme ve çoklu-seçim motoru.
 *
 *  NE YAPAR (özet):
 *  Tablo listesindeki tekil ve toplu silme akışlarını, geri-yükleme ve
 *  kalıcı silmeyi, ve checkbox tabanlı çoklu seçim durumunu yönetir.
 *  Aktif sekmeye (Tablolar / İlişkiler / dinamik tablo) göre doğru bulk
 *  mutation'a yönlendirir.
 *
 *  - deleteDatatableById / hardDelete / backToDelete : tekil sil / kalıcı
 *      sil / geri yükle (soft-delete çöp kutusu akışı) + sekme senkronu.
 *  - checkedAll / deleteCheckbox : "hepsini seç" ve seçim değiştikçe toplu
 *      silme butonunun görünürlüğünü DOM checkbox'larından türetir.
 *  - deleteCheckedRow / deleteAction : seçili id'leri toplayıp aktif sekmeye
 *      uygun bulk silme mutation'ını çağırır, ardından seçimi temizler.
 *  - deleteTableMultiple : toast kuyruğunu ve "hepsini seç" kutusunu sıfırlar.
 *
 *  Sekme-duyarlı bulk yönlendirme + DOM-checkbox seçim köprüsü bu dosyanın
 *  özgün emeğidir; paylaşılan sürümde gizlenmiştir.
 *
 * Kaynak kodu talep üzerine paylaşılabilir.
 * Source available on request.
 */
export const useDatatableActions = (_params: UseDatatableActionsParams): DatatableActionsApi => {
  //  Silme (tekil/bulk/geri-yükle) + checkbox çoklu-seçim motoru.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};