import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
  changedMap: boolean;
  antdSize: string;
  dateHeight: string;
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
 * DateInput — AntD tarih seçici (min/max sınırlı) girişi.
 *
 *  "DD-MM-YYYY" formatında tarih seçtirir; inputProps.min/max ile geçmiş/
 *  gelecek günleri disabledDate üzerinden kısıtlar; değişimi forma ve
 *  handleChange'e yazar, değişiklik durumunu işaretler. Gizlenmiştir.
 */
export const DateInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
