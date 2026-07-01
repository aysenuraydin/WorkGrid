import { IInputProps } from 'hooks/useCellLogic';
interface CellProps { val: string; colClass: string; clssnm?: string; inputProps: IInputProps; }

/**
 * ColorCell — renk değerini kendi rengiyle boyalı rozet olarak gösterir. 
 *  Değer bir renk kodu olarak alınır; metin rengi o renk, arka plan aynı
 *  rengin şeffaf tonu yapılır. Gizlenmiştir. 
 */
export const ColorCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
