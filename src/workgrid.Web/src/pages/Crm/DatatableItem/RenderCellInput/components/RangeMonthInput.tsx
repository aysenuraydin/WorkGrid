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
 * RangeMonthInput — AntD tarih/aralık seçici girişi (min/max + aralık sınırı).
 *
 *  NE YAPAR (özet):
 *  Ay aralığı ("YYYY-MM - YYYY-MM"); min/max ve rangeLimit (ay) ile\n *  aralık kısıtlanır.
 *
 *  Tarih ayrıştırma, disabledDate ile min/max ve rangeLimit hesabı  
 */
export const RangeMonthInput = (_props: InputProps): JSX.Element => {
  //  Ay aralığı + rangeLimit ay hesabı.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
