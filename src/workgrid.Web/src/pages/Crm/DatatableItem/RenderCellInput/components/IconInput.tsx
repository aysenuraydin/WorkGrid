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
 * IconInput — aranabilir ikon seçici girişi. 
 *  Açılır panelde ikon listesini arama kutusuyla filtreler, ızgara halinde
 *  gösterir, seçileni forma/handleChange'e yazar; dışarı tıklayınca kapanır,
 *  seçili ikon insan-okunur etiketiyle görünür. Arama/dropdown mantığı
 *  gizlenmiştir. 
 */
export const IconInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
