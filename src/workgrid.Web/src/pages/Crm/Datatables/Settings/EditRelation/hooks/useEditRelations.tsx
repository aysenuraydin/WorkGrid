import { TableColumn } from "common/data/TableColumn";
import { FormikProps } from "formik";

export interface IForeignTableRelation {
  id?: number;
  foreignTableId: number;
  label?: string;
  value?: number;
  createOrUpdateColumnId: number | null;
  listColumnIds: number[];
  selectedRowIds?: string;
  isMultiSelect?: boolean;
}

export interface IEditRelationsFormValues {
  id: number | string;
  foreignTables: IForeignTableRelation[];
}

/**
 * useEditRelations — tablolar arası ilişki (foreign table) editörü.
 *
 *  NE YAPAR (özet):
 *  Bir tablonun başka tablolarla olan ilişkilerini (foreignTablesFk) düzenler:
 *  hangi tabloya bağlı olduğu, hangi kolonun oluştur/güncelle anahtarı olduğu,
 *  listede hangi kolonların gösterileceği ve ilişkinin çoklu-seçim olup olmadığı.
 *
 *  - Yükleme: server'daki her foreignTablesFk kaydı forma normalize edilir;
 *      listColumnIds için "1,2,3" STRING'i ↔ number[] DİZİSİ çift yönlü çevrilir;
 *      ilişkili tablo adı (label) tables listesinden eşlenir.
 *  - Kolon haritası: tüm tabloların kolonları { [tableId]: TableColumn[] }
 *      sözlüğüne indirgenir (ilişki kurarken hedef kolonları seçebilmek için).
 *  - Kaydetme: form değerleri tekrar backend biçimine (listColumnIds join,
 *      createOrUpdateColumnId string) çevrilip bulk update mutation'a gönderilir.
 *  - Ayrıca focus/changed izleme ve accordion açık-ilişki takibi.
 *
 *  listColumnIds string↔array çevrimi ve çoklu-ilişki normalize/serialize
 *  mantığı  
 */
export const useEditRelations = (
  _id: number,
  _modal: boolean,
  _isSettings: boolean
): {
  formik: FormikProps<IEditRelationsFormValues>;
  focusMap: { [key: string]: boolean };
  foreignTables: IForeignTableRelation[];
  setForeignTables: React.Dispatch<React.SetStateAction<IForeignTableRelation[]>>;
  setChangedMap: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  handleFocus: (e: React.FocusEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  changedMap: { [key: string]: boolean };
  openDefault: string;
  setOpenDefault: React.Dispatch<React.SetStateAction<string>>;
  toggleDefault: (id: string) => void;
  columns: { [tableId: number]: TableColumn[] };
  tables: any;
} => {
  //  Foreign-table ilişki normalize/serialize + listColumnIds str↔array.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};