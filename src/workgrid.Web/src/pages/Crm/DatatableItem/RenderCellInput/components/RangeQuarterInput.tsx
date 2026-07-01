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
 * RangeQuarterInput — AntD tarih/aralık seçici girişi (min/max + aralık sınırı).
 *
 *  NE YAPAR (özet):
 *  Çeyrek aralığı ("YYYY-Q1 - YYYY-Q3"); min/max ve rangeLimit (çeyrek)\n *  ile kısıtlanır.
 *
 *  Tarih ayrıştırma, disabledDate ile min/max ve rangeLimit hesabı  
 */
export const RangeQuarterInput = (_props: InputProps): JSX.Element => {
  //  Çeyrek aralığı + rangeLimit çeyrek hesabı.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
