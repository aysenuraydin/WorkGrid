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
  col: any;
}

/**
 * ParentInput — aynı tablodaki üst kayıt (parent) seçici.
 *
 *  NE YAPAR (özet):
 *  Hedef tablonun etiket kolonundan (foreignTablesFk → createOrUpdateColumnId)
 *  rowId→etiket haritası kurar; kendi satırı hariç seçenekleri listeler ve
 *  seçilen üst kayıt id'sini forma/handleChange'e yazar.
 *
 *  Etiket haritası + self-exclude mantığı  
 */
export const ParentInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
