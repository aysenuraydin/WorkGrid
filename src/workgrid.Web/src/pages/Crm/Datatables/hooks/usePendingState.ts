import { UpdateItem } from "../components/Datatables";

type PendingUpdates = { [tableId: number]: { [cellId: number]: UpdateItem } };
type DeletedRowIds = { [tableId: number]: number[] };

export interface PendingStateApi {
  pendingUpdates: PendingUpdates;
  setPendingUpdates: React.Dispatch<React.SetStateAction<PendingUpdates>>;
  deletedRowIds: DeletedRowIds;
  setDeletedRowIds: React.Dispatch<React.SetStateAction<DeletedRowIds>>;
  changePending: (val: { [cellId: number]: UpdateItem }, tableId: number) => void;
  changeDeleting: (val: number[], tableId: number) => void;
  clearPendingUpdatesForTable: (tableId: number) => void;
  getPendingCountForTable: (tableId: number) => number;
}

/**
 * usePendingState — Datatable "kaydedilmemiş değişiklik" motoru.
 *
 *  NE YAPAR (özet):
 *  Her tablo (tableId) için, kullanıcının henüz kaydetmediği HÜCRE
 *  güncellemelerini ve SİLİNMEK üzere işaretlenen satır id'lerini ayrı ayrı,
 *  tablo-izole sözlüklerde tutar. Sekme başlığındaki "N değişiklik" rozeti
 *  ve kapatırken çıkan "kaydet?" uyarısı bu state'ten beslenir.
 *
 *  - pendingUpdates[tableId][cellId] = { cellId, value } : bekleyen hücreler.
 *  - deletedRowIds[tableId] = number[]                   : silinecek satırlar.
 *  - changePending / changeDeleting : ilgili tablonun kaydını değiştirir.
 *  - clearPendingUpdatesForTable    : bir tablonun tüm bekleyenlerini atar.
 *  - getPendingCountForTable        : hücre + satır bekleyen toplam sayısı
 *                                     (rozet ve "kaydet?" tetikleyicisi).
 *
 *  Tablo-izole bekleyen-değişiklik defteri, birden fazla tablo sekmesi açıkken
 *  her birinin kendi kirli durumunu bağımsız taşımasını sağlar; bu tasarım
 *  Datatable düzenleyicisinin özgün emeğidir ve gizlenmiştir.
 *
 * Kaynak kodu talep üzerine paylaşılabilir.
 * Source available on request.
 */
export const usePendingState = (): PendingStateApi => {
  //  Tablo-izole bekleyen hücre güncellemeleri + silinen satır defteri.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};