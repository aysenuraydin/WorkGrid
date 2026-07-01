import { Dispatch, SetStateAction } from "react";
import { DataType } from "common/enums/DataType";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { ModalSizeType } from "common/enums/ModalSizeType";
import { Datatable } from "common/data/Datatable";

interface UseCreateRowFormikProps {
  modal: boolean;
  modalType?: DataType;
  modalSize: ModalSizeType;
  columns: TableColumn[];
  table: Datatable | undefined;
  rowId: number;
  row: TableRow | undefined;
  fileManagerRefs: React.MutableRefObject<any>;
  selectedForDeletion: { [key: string]: string[] };
  filteredFileIds: number[];
  setModal?: Dispatch<SetStateAction<boolean>>;
  toggle?: () => void;
}
export interface ICellData {
  [columnId: string]: string | boolean | number | any;
}
export interface IFormValues {
  cells: { [rowId: string]: ICellData };
}

/**
 * useCreateRowFormik — tek satır oluştur/güncelle formunun çekirdeği.
 *
 *  NE YAPAR (özet):
 *  Bir tablo satırını modal/sayfa üzerinden ekleme veya düzenleme akışını
 *  yönetir: dinamik doğrulama, dosya yükleme/silme, yalnızca değişen hücreleri
 *  kaydetme ve kaydettikten sonra yönlendirme/sekme davranışı.
 *
 *  - initialValues: create'te boş, edit'te satırın mevcut hücre değerleri
 *      (cells[rowId][colId]); modal boyutu hazır olmadan kurulmaz.
 *  - Şema: createDynamicYupSchema(columns) ilgili satıra uygulanır.
 *  - Edit gönderimi: dosya kolonları için uploadAllFiles + buildFinalFileValue
 *      (orijinal - silinen + yüklenen); diğer kolonlar için değer normalize edilip
 *      (boolean→"1"/"0") initial ile KARŞILAŞTIRILIR; yalnızca DEĞİŞENLER bulk
 *      cell update payload'ına girer (gereksiz yazma yok).
 *  - Create gönderimi: tüm hücreler (dosyalar yüklenmiş haliyle) createTableRow
 *      ile tek satır olarak yaratılır.
 *  - afterSuccess: modal boyutuna göre (Blank→pencere kapat, diğer→toggle/route)
 *      davranır; BroadcastChannel ile diğer sekmelere REFRESH_TABLE yayınlar.
 *  - deletePendingFiles: silmeye işaretlenen dosyaları temizler.
 *  - handleChange: değeri forma yazar, ilişkili kolonları (relatedCols) senkronlar.
 *
 *  Değişen-hücre diff'i, dosya birleştirme ve çok-sekme senkron yayını 
 */
export const useCreateRowFormik = (_props: UseCreateRowFormikProps): any => {
  //  Dinamik Yup + create/edit + dosya merge + değişen-hücre diff + broadcast.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};