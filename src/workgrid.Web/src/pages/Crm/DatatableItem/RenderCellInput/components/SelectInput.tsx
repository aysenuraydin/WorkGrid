import { DataType } from 'common/enums/DataType';
import { IInputProps } from 'hooks/useCellLogic';
import { IExtraProps } from '..';

interface InputProps {
  modalType: DataType;
  setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
  formik: any;
  inputProps: IInputProps;
  handleChange: (val: any, ...args: any[]) => void;
  key: string;
  extra: IExtraProps | any;
  value: any;
  val: any;
  changedMap: boolean;
  colId: number;
  rowId: number;
  cellId: number;
  antdSize: string;
  setFocusMap: any;
  focusMap: any;
  targetHeight: any;
}

/**
 * SelectInput — react-select tabanlı tekil/çoklu seçim girişi.
 *
 *  NE YAPAR (özet):
 *  Kolonun seçenek listesini (",*," ile ayrılmış) react-select opsiyonlarına
 *  çevirir; tekil veya çoklu seçimi yönetir ve değeri yine ",*," ile birleştirip
 *  forma/handleChange'e yazar. Seçili değerler ham string'den ayrıştırılır;
 *  değişiklik/hata/görünüm durumlarına göre stillenir.
 *
 *  Seçenek serileştirme ve seçili değer çözümü  
 */
export const SelectInput = (_props: InputProps): JSX.Element => {
  //  react-select + ",*," serileştirme + tekil/çoklu değer çözümü.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
