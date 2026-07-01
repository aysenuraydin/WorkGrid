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
 * BadgesInput — çoklu etiket (tag) girişi.
 *
 *  Enter veya "Ekle" ile etiket ekler, çip olarak gösterir, çarpıyla siler;
 *  etiketleri virgülle ayrılmış tek string'e serileştirip forma/handleChange'e
 *  yazar (tekrarları engeller). Gizlenmiştir.
 */
export const BadgesInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
