import { Datatable } from "common/data/Datatable";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { UpdateItem } from "pages/Datatables/components/Datatables";

interface UseEditRowsFormProps {
  table: Datatable;
  rows: { [tableId: number]: (TableRow & { isAdded?: boolean })[] };
  columns: { [tableId: number]: TableColumn[] };
  setRows: React.Dispatch<React.SetStateAction<{ [tableId: number]: (TableRow & { isAdded?: boolean })[] }>>;
  changePending: (updates: { [cellId: number]: UpdateItem }, tableId: number) => void;
}
 
/**
 * useEditRowsForm — tek tablo satır düzenleyicisinin form + hesaplama motoru.
 *
 *  NE YAPAR (özet):
 *  EAV modelindeki (satır × kolon → hücre) verileri tek bir Formik formuna
 *  bağlar, kolon-tabanlı dinamik doğrulama uygular, hesaplanan alanları
 *  otomatik günceller ve her değişikliği kaydedilecek "pending" defterine yazar.
 *
 *  - initialValues: her satır için cells[rowId][colId] = mevcut hücre değeri.
 *  - Dinamik şema: createDynamicYupSchema(columns) ile her satıra kolonların
 *      doğrulama kurallarından üretilmiş şema uygulanır.
 *  - Hesaplanan alanlar (functionText): formüldeki {{kolonId}} referansları o
 *      satırın güncel değerleriyle değiştirilip güvenli biçimde değerlendirilir;
 *      sonuç ilgili hücreye yazılır ve pending'e eklenir (tip normalizasyonu ile).
 *  - Bağ→foreign doldurma: bağ kolonu (realColumnId==null) dolu ama eşlenik
 *      foreign kolon boşsa, bağdaki rowId foreign kolona kopyalanır (API'ye
 *      ilişki dolu gitsin diye) ve pending güncellenir.
 *  - handleChange: değeri forma yazar; kayıtlı satırlarda pending'e ekler,
 *      yeni (isAdded) satırlarda doğrudan local cellsFk'i günceller; ilişkili
 *      kolonları (relatedCols) tek seferde senkronlar.
 *
 *  Formül değerlendirme, bağ↔foreign senkronu ve tablo-izole pending defteri 
 */
export const useEditRowsForm = (_props: UseEditRowsFormProps): any => {
  //  Dinamik Yup + hesaplanan-alan formül motoru + bağ↔foreign + pending.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};