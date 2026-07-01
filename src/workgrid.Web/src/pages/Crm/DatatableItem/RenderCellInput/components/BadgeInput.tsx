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
 * BadgeInput — renk + metin ikili rozet girişi.
 *
 *  Değeri "renk`metin" biçiminde tek string'e serileştirir; renk bir enum
 *  seçiminden, metin serbest girişten gelir; her değişimde iki parça birleştirilip
 *  forma/handleChange'e yazılır. Gizlenmiştir.
 */
export const BadgeInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
