import { TableColumn } from "common/data/TableColumn";
import { DeletedTableColumn, ExtendedTableColumn } from "components/Common/interfaces/TableColumnContextType";
import { MutableRefObject } from "react";

/**
 * useColumnActions — kolon kirli-durum işaretleme defteri.
 *
 *  NE YAPAR (özet):
 *  EditColumns ekranında kolonlar üzerinde yapılan düzenleme/ekleme/silme
 *  niyetlerini, henüz kaydedilmeden local state'te işaretler. useColumnPersistence
 *  daha sonra bu işaretlere göre backend'e yazar.
 *
 *  - markToBeEdited: bir kolonun alanlarını (ad/tip/görünür...) local günceller.
 *  - markToBeAdded:  yeni kolonu isAdded=true ile listeye ekler, tableOrder'ı
 *      son sıranın bir fazlası yapar, initialColumnsRef'i günceller.
 *  - markToBeDeleted: eklenmiş-ama-kaydedilmemişse listeden çıkarır; aksi halde
 *      isDeleted=true işaretler ve silinenler listesine taşır.
 *  - lastTableOrder: görünür kolonların son sıra değerini türetir.
 *
 *  Kaydedilmemiş ekleme/silme/düzenleme niyetlerini tek local defterde tutan 
 */
export const useColumnActions = (
  _setColumns: React.Dispatch<React.SetStateAction<ExtendedTableColumn[]>>,
  _initialColumnsRef: MutableRefObject<ExtendedTableColumn[]>,
  _visibleColumns: ExtendedTableColumn[],
  _setDeletedColumns: React.Dispatch<React.SetStateAction<DeletedTableColumn[]>>
): {
  markToBeEdited: (col: Partial<ExtendedTableColumn> & { id: number }) => void;
  markToBeAdded: (col: TableColumn) => void;
  markToBeDeleted: (col: ExtendedTableColumn) => void;
  lastTableOrder: number;
} => {
  //  Kaydedilmemiş ekleme/silme/düzenleme işaretleme defteri.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};