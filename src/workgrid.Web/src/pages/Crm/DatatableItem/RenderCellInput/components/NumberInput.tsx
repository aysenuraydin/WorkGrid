import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
  isEditRow: boolean;
  focusMap: any;
  changedMap: boolean;
  antdSize: string;
  isError: boolean;
  modalType: DataType;
  format?: any;
  inputRule: any;
  setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
  extra: IExtraProps | any;
  formik: any;
  inputProps: IInputProps;
  handleChange: (val: any, ...args: any[]) => void;
  key: string;
  value: any;
  val: any;
  colId: number;
  rowId: number;
  cellId: number;
}

/**
 * NumberInput — adımlı (stepper) sayı girişi.
 *
 *  NE YAPAR (özet):
 *  Artı/eksi düğmeleriyle inputProps.step kadar artırıp azaltan sayı girişi;
 *  prefix/suffix ve isteğe bağlı biçimlendirilmiş (FormatInput) mod destekler;
 *  boyuta göre ölçeklenir, değişimi forma/handleChange'e yazar.
 *
 *  Stepper ve biçim entegrasyonu gizlenmiştir. 
 */
export const NumberInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
