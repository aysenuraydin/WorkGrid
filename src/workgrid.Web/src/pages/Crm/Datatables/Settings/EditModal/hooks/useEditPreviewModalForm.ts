import { TableColumn } from "common/data/TableColumn";
import { IModalDesignExtended } from "../components/EditPreviewModal";
import { Datatable } from "common/data/Datatable";

type CellValue = string | { ids: number[] };
export interface IAddRowFormValues {
  id: number;
  cells: { [rowId: number]: { [columnId: number]: CellValue } };
}

/**
 * useEditPreviewModalForm — modal tasarımının önizleme formu + kaydetme.
 *
 *  NE YAPAR (özet):
 *  Tasarım önizlemesindeki canlı girdileri besleyen Formik formunu kurar ve
 *  tamamlanan modal tasarımını (kolon yerleşimleri + modal yüksekliği)
 *  backend'e yazar.
 *
 *  - initialValues: her kolon için cells[0][colId] boş başlatılır.
 *  - Dinamik Yup şeması: foreign-key kolonlar (realColumnId != null) için
 *      { ids: array().min(1) } zorunluluğu kolon kolon üretilir.
 *  - handleSubmit: designColumns'tan name/type ayıklanıp modal tasarım payload'ı
 *      (columnDesigns + modalHeight) bulk mutation ile kaydedilir.
 *  - handleChange: cells.{rowId}.{colId} yolunu setFieldValue ile günceller.
 *
 *  Kolon tiplerine göre dinamik doğrulama şeması üretimi bu dosyanın özgün
 *  emeğidir; gizlenmiştir.
 *
 * Kaynak kodu talep üzerine paylaşılabilir.
 * Source available on request.
 */
export const useEditPreviewModalForm = (
  _table: Datatable,
  _columns: TableColumn[],
  _designColumns: IModalDesignExtended[],
  _modalHeight: number | undefined
): any => {
  //  Dinamik Yup şema üretimi + modal tasarım bulk kaydetme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};