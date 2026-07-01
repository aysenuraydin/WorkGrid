import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';
import { TableColumn } from 'common/data/TableColumn';
import { TableCell } from 'common/data/TableCell';

interface InputProps {
  changedMap: boolean;
  targetHeight: number;
  modalType: DataType;
  setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
  extra: IExtraProps | any;
  formik: any;
  inputProps: IInputProps;
  handleChange: (val: any, ...args: any[]) => void;
  key: string;
  value: any;
  col: TableColumn;
  columns: TableColumn[];
  cells: TableCell[];
  rowId: number;
  cellId: number;
  isError: boolean;
}

/**
 * ForeignColumnInput — ilişkili (foreign) kolon seçim girişi. 
 *  NE YAPAR (özet):
 *  Bir satırı başka bir tablonun satır(lar)ına bağlayan react-select tabanlı
 *  ilişki editörü; tekil/çoklu seçim, bağ-kolon geri-dolumu ve ilişki
 *  senkronunu yönetir.
 *
 *  - Seçenekler hedef tablonun hücrelerinden { label: değer, value: rowId }
 *      olarak üretilir.
 *  - Değer boşsa, aynı ilişkinin bağ kolonundaki (realColumnId==null) değere
 *      düşülür (fallback); seçili id'ler "label:id" veya ham id biçiminden
 *      ayrıştırılır.
 *  - Seçim değişince: aynı realTableId'yi paylaşan diğer (ayna) kolonlar
 *      relatedCols olarak tek seferde senkronlanır; yeni satır (rowId==0) ile
 *      mevcut satır için farklı yazma yolları izlenir; forma yalnızca rowId'ler
 *      yazılır (etiketler değil).
 *  - ForeignColumn tipi değilse: salt-okunur, prefix/suffix'li düz gösterim.
 *
 *  Bağ-kolon fallback'i ve çok-kolon ilişki senkronu  
 */
export const ForeignColumnInput = (_props: InputProps): JSX.Element => {
  //  İlişki select'i + bağ-kolon fallback + relatedCols senkron + serileştirme.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
