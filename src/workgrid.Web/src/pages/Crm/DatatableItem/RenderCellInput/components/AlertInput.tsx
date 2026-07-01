import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
  modalType: DataType;
  setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
  extra: IExtraProps;
  formik: any;
  inputProps: IInputProps;
  handleChange: (val: any, ...args: any[]) => void;
  key: string;
  value: string | number | boolean | null | any;
  colId: number;
  rowId: number;
  cellId: number;
}

/**
 * AlertInput — seviye + metin ikili uyarı girişi.
 *
 *  Değeri "seviye`metin" biçiminde tek string'e serileştirir; seviye bir enum
 *  seçiminden, metin textarea'dan gelir; her değişimde birleştirilip forma/
 *  handleChange'e yazılır. Gizlenmiştir. 
 */
export const AlertInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
