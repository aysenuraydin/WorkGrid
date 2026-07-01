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
 * UsersInput — aranabilir kullanıcı (üye) seçici girişi.
 *
 *  NE YAPAR (özet):
 *  Tüm kullanıcıları listeler, isimle arattırır, avatar (yoksa baş harf + renk)
 *  ile gösterir; tekil/çoklu seçimi yönetip seçili id'leri virgülle birleştirip
 *  forma/handleChange'e yazar.
 *
 *  Arama + tekil/çoklu seçim serileştirmesi gizlenmiştir. 
 */
export const UsersInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
