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
 * RangeDatetimeLocalInput — AntD tarih/aralık seçici girişi (min/max + aralık sınırı).
 *
 *  NE YAPAR (özet):
 *  Tarih-saat aralığı ("DD-MM-YYYY HH:mm - ..."); min/max ve rangeLimit\n *  (gün) ile kısıtlanır.
 *
 *  Tarih ayrıştırma, disabledDate ile min/max ve rangeLimit hesabı  
 *
 * Kaynak kodu talep üzerine paylaşılabilir.
 * Source available on request.
 */
export const RangeDatetimeLocalInput = (_props: InputProps): JSX.Element => {
  //  Tarih-saat aralığı + rangeLimit gün hesabı.
  //  (Gövde gizlendi — yukarıdaki açıklama bloğuna bakınız.)
  throw new Error("Source available on request.");
};
