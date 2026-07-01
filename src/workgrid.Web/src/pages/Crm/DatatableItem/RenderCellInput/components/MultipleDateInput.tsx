import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
  changedMap: boolean;
  antdSize: string;
  dateHeight: string;
  firstPlaceholder?: any;
  secondPlaceholder?: any;
  isError: boolean;
  modalType: DataType;
  setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
  extra: IExtraProps | any;
  formik: any;
  inputProps: IInputProps;
  handleChange: (val: any, ...args: any[]) => void;
  key: string;
  value: any;
  colId: number;
  rowId: number;
  cellId: number;
}

/**
 * MultipleDateInput — AntD tarih/aralık seçici girişi (min/max + aralık sınırı). 
 *  NE YAPAR (özet):
 *  Çoklu tarih seçimi ("DD-MM-YYYY", virgülle birleştirilmiş); min/max ile\n *  gün kısıtlaması uygular; değeri forma/handleChange'e yazar.
 *
 *  Tarih ayrıştırma, disabledDate ile min/max ve rangeLimit hesabı  
 */
export const MultipleDateInput = (_props: InputProps): JSX.Element => {
  //  Çoklu tarih seçimi + min/max disabledDate.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
