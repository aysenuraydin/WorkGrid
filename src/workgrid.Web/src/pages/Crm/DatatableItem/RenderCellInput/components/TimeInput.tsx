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
 * TimeInput — AntD saat seçici (min/max sınırlı) girişi.
 *
 *  "HH:mm" saat seçtirir; inputProps.min/max ile saat ve dakika bazında
 *  disabledTime uygular; değeri forma/handleChange'e yazar. Saat/dakika
 *  kısıtlama hesabı gizlenmiştir. 
 */
export const TimeInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
