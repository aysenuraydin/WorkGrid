import { IInputProps } from 'hooks/useCellLogic';
interface CellProps { val: string; colClass: string; inputProps: IInputProps; }

/**
 * RadioCell — radio değerini salt-okunur gösterir. 
 *  Seçenek yoksa tekil işaretli/işaretsiz kutu; seçenek varsa listeyi radio
 *  olarak, seçili değeri işaretli çizer. Gizlenmiştir. 
 */
export const RadioCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
