import { DataType } from 'common/enums/DataType';
import { IExtraProps } from '..';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
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
  antdSize: string;
  isError: boolean;
}

/**
 * HtmlInput — Monaco kod editörü + canlı önizleme girişi. 
 *  HTML değerini "kod" (Monaco, vs-dark, otomatik format/wrap) ve "önizleme"
 *  (render edilmiş HTML) arasında geçirir; View modunda salt-okunur; değişimi
 *  forma/handleChange'e yazar. Editör konfigürasyonu gizlenmiştir. 
 */
export const HtmlInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
