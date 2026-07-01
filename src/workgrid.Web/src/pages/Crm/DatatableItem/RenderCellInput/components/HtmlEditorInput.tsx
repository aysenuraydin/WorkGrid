import { DataType } from 'common/enums/DataType';
import { IInputProps } from 'hooks/useCellLogic';

interface InputProps {
  modalType: DataType;
  setChangedMap: React.Dispatch<React.SetStateAction<boolean>>;
  isError: boolean;
  formik: any;
  inputProps: IInputProps;
  handleChange: (val: any, ...args: any[]) => void;
  key: string;
  value: any;
  changedMap: boolean;
  colId: number;
  rowId: number;
  cellId: number;
  antdSize: string;
  setFocusMap: React.Dispatch<React.SetStateAction<boolean>>;
  focusMap: boolean;
}

/**
 * HtmlEditorInput — CKEditor tabanlı zengin metin girişi. 
 *  Zengin metin (WYSIWYG) düzenleyici; View modunda salt-okunur'a geçer,
 *  değişimi forma/handleChange'e yazar, boyuta göre minimum yükseklik ve
 *  değişiklik vurgusu uygular. CKEditor entegrasyonu gizlenmiştir. 
 */
export const HtmlEditorInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
