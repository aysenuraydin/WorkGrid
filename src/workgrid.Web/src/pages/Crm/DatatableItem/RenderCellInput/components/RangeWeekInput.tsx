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
 * RangeWeekInput — AntD tarih/aralık seçici girişi (min/max + aralık sınırı).
 *
 *  NE YAPAR (özet):
 *  Hafta aralığı ("YYYY-WW - YYYY-WW", isoWeek); min/max ve rangeLimit\n *  (hafta) ile kısıtlanır.
 *
 *  Tarih ayrıştırma, disabledDate ile min/max ve rangeLimit hesabı   
 */
export const RangeWeekInput = (_props: InputProps): JSX.Element => {
  //  Hafta aralığı (isoWeek) + rangeLimit hafta hesabı.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
