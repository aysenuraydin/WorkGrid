import { Datatable } from "common/data/Datatable";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { FormValues } from "..";

interface UseEditRowsFlatRowsProps {
  table: Datatable;
  rows: { [tableId: number]: (TableRow & { isAdded?: boolean })[] };
  columns: { [tableId: number]: TableColumn[] };
  formikValues: FormValues;
}

/**
 * useEditRowsFlatRows — EAV satırlarını düz tablo satırlarına çevirir.
 *
 *  NE YAPAR (özet):
 *  (satır × kolon → hücre) EAV yapısını, TanStack Table'ın beklediği düz
 *  { id, "<safe>-col-<colId>": değer } nesnelerine dönüştürür.
 *
 *  - Satırlar createdAt'e göre sıralanır.
 *  - Her satır için kolon değerleri formik.cells'ten okunup güvenli (safeName)
 *      kolon anahtarlarıyla düz nesneye yazılır (arama/sıralama bu düz alanlar
 *      üzerinden çalışsın diye).
 *
 *  EAV→düz projeksiyon ve çakışmasız kolon anahtarı üretimi  
 */
export const useEditRowsFlatRows = (_props: UseEditRowsFlatRowsProps): { flatRows: any[] } => {
  //  EAV satır → düz obje (safeName kolon anahtarları) projeksiyonu.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
    throw new Error("Source available on request.");
};