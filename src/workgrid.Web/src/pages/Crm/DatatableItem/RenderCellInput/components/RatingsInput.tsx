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
}

/**
 * RatingsInput — yarım-yıldız destekli puanlama girişi.
 *
 *  AntD Rate ile yarım-yıldız puanlama; View/readonly modunda kilitli; değeri
 *  forma/handleChange'e yazar. Gizlenmiştir. 
 */
export const RatingsInput = (_props: InputProps): JSX.Element => {
  throw new Error("Source available on request.");
};
