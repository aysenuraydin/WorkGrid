import { TableColumn } from "common/data/TableColumn";
import { DeletedTableColumn, ExtendedTableColumn } from "components/Common/interfaces/TableColumnContextType";

/**
 * useColumnPersistence — kolon düzenleyicinin kaydetme orkestratörü.
 *
 *  NE YAPAR (özet):
 *  EditColumns ekranında biriken TÜM kolon değişikliklerini tek "Kaydet"
 *  akışında backend'e yazar ve local durumu senkron tutar. useColumnActions'ın
 *  işaretlediği kirli durumları (added / deleted / updated) bu hook kalıcılaştırır.
 *
 *  handleSaveAll beş aşamalı çalışır (her biri yalnızca ilgili kayıt varsa):
 *    1. Ekleme       → createBulkTableColumn (yeni kolonlar, id'siz payload)
 *    2. Silme        → deleteBulkTableColumn (soft-delete)
 *    3. Güncelleme   → updateBulkTableColumn (ad/tip/görünür/filtre/sıra)
 *    4. Geri yükleme → restoreBulkTableColumn (çöp kutusundan)
 *    5. Kalıcı silme → hardDeleteBulkTableColumn
 *  Her adımda ensureSucceeded ile HTTP 200 içindeki Result.Failure yakalanır;
 *  hata mesajı API gövdesinden (string / message / errors[]) çıkarılıp gösterilir.
 *
 *  Ayrıca: server'dan gelen kolonları local pending-added ile çakışmadan
 *  birleştirme, silinen kolonları yükleme, ve liste değişince en alta
 *  otomatik scroll efektleri. backToDeleteColumn / hardDeleteTableColumn ile
 *  çöp kutusu işaretleme.
 *
 *  Beş-aşamalı sıralı bulk kaydetme, kısmi-başarı hata çıkarımı ve pending
 *  merge mantığı  
 */
export const useColumnPersistence = (
  _columns: ExtendedTableColumn[],
  _modal: boolean,
  _setIsMove: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  _visibleColumns: ExtendedTableColumn[],
  _initialColumnsRef: React.MutableRefObject<ExtendedTableColumn[]>,
  _id: number,
  _setColumns: React.Dispatch<React.SetStateAction<ExtendedTableColumn[]>>,
  _deletedColumns: DeletedTableColumn[],
  _setDeletedColumns: React.Dispatch<React.SetStateAction<DeletedTableColumn[]>>
): {
  hardDeleteTableColumn: (col: TableColumn & { isBackDeleted: boolean; isHardDelete: boolean; deletedAt: string }) => void;
  backToDeleteColumn: (col: TableColumn & { isBackDeleted: boolean; isHardDelete: boolean; deletedAt: string }) => void;
  handleSaveAll: () => Promise<void>;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
} => {
  //  5-aşamalı bulk kolon kaydetme + kısmi-başarı hata çıkarımı + merge.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};