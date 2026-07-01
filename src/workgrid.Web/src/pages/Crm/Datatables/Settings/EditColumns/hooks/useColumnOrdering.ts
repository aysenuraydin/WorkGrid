import { ExtendedTableColumn } from "components/Common/interfaces/TableColumnContextType";

/**
 * useColumnOrdering — kolon sıralama motoru. 
 *  NE YAPAR (özet):
 *  Görünür kolonları yukarı/aşağı taşıyarak tableOrder değerlerini takas eder;
 *  onaylama ve iptal (başlangıca dönme) sağlar.
 *
 *  - moveUp / moveDown: hedef kolonu komşusuyla tableOrder değerini takas
 *      ederek yer değiştirir (sınırdaysa no-op), taşınan kolonu isMove ile
 *      işaretler.
 *  - confirmOrder: mevcut görünür sırayı initialColumnsRef'e sabitler,
 *      isMove'u temizler.
 *  - resetOrder: initialColumnsRef'teki başlangıç sırasına geri döner.
 *
 *  Order takası + onay/iptal referans yönetimi  
 */
export const useColumnOrdering = (
  _columns: ExtendedTableColumn[],
  _setIsMove: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  _visibleColumns: ExtendedTableColumn[],
  _initialColumnsRef: React.MutableRefObject<ExtendedTableColumn[]>,
  _setColumns: React.Dispatch<React.SetStateAction<ExtendedTableColumn[]>>
): {
  moveDown: (id: number) => void;
  moveUp: (id: number) => void;
  resetOrder: () => void;
  confirmOrder: () => void;
} => {
  //  Kolon order takası + onay/iptal (başlangıca dönme) motoru.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};