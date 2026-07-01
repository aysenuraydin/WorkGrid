import { DataType } from 'common/enums/DataType';
import { IInputProps } from 'hooks/useCellLogic';
import { IExtraProps } from '..';

interface InputProps {
  changedMap: boolean;
  antdSize: string;
  dateHeight: string;
  firstPlaceholder: string;
  secondPlaceholder: string;
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
 * DatetimeLocalInput — AntD tarih+saat seçici (min/max sınırlı) girişi. 
 *  "DD-MM-YYYY HH:mm" formatında tarih-saat seçtirir; inputProps.min/max ile
 *  gün bazında sınırlama uygular; değişimi forma/handleChange'e yazar.
 *  Gizlenmiştir. 
 */
export const DatetimeLocalInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
