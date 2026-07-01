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
 * RangeDateInput — AntD tarih/aralık seçici girişi (min/max + aralık sınırı).
 *
 *  NE YAPAR (özet):
 *  Tarih aralığı ("DD-MM-YYYY - DD-MM-YYYY"); min/max ve rangeLimit (gün)\n *  ile başlangıçtan itibaren izin verilen aralık hesaplanır.
 *
 *  Tarih ayrıştırma, disabledDate ile min/max ve rangeLimit hesabı   
 */
export const RangeDateInput = (_props: InputProps): JSX.Element => {
  //  Tarih aralığı + rangeLimit gün hesabı.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
