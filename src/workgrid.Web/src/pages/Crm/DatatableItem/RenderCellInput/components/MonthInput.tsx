import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

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
 * MonthInput — AntD ay seçici (min/max sınırlı) girişi. 
 *  "YYYY-MM" formatında ay seçtirir; min/max sınırlarını hem "YYYY-MM" hem
 *  "DD-MM-YYYY" biçiminden ayrıştırıp ay bazında disabledDate uygular.
 *  Gizlenmiştir. 
 */
export const MonthInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
