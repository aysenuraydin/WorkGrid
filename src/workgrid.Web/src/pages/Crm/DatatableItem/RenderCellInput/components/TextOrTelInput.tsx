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
  inputRule: any;
  key: string;
  val: any;
  format: any;
  colId: number;
  rowId: number;
  cellId: number;
}

/**
 * TextOrTelInput — biçimlendirilebilir metin/telefon girişi.
 *
 *  Prefix/suffix'li metin girişi; bir biçim kuralı (inputRule) verilmişse
 *  maskeli FormatInput, verilmemişse düz Input kullanır; değeri forma/
 *  handleChange'e yazar. Biçim entegrasyonu gizlenmiştir. 
 */
export const TextOrTelInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
