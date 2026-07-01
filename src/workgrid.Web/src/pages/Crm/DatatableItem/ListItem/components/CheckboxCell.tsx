import { IInputProps } from 'hooks/useCellLogic';
interface CellProps { val: string; colClass: string; inputProps: IInputProps; }

/**
 * CheckboxCell — checkbox değerini salt-okunur gösterir.
 *  Seçenek yoksa tekil işaretli/işaretsiz kutu; seçenek varsa ",*," ile
 *  ayrılmış çoklu seçimleri işaretli olarak listeler. Gizlenmiştir. 
 */
export const CheckboxCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
