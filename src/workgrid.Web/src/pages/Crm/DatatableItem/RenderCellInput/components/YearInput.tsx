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
 * YearInput — AntD yıl seçici (min/max sınırlı) girişi.
 *
 *  "YYYY" yıl seçtirir; min/max sınırlarını çeşitli biçimlerden ayrıştırıp
 *  disabledDate uygular; değeri forma/handleChange'e yazar. Yıl kısıtlama
 *  hesabı gizlenmiştir. 
 */
export const YearInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
