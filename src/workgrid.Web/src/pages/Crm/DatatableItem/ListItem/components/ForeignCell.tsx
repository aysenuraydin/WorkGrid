import { TableCell } from 'common/data/TableCell';
import { TableColumn } from 'common/data/TableColumn';
interface CellProps { val: string; colClass: string; isIcon: boolean; clssnm: string; cells: TableCell[]; col: TableColumn; }

/**
 * ForeignCell — foreign id listesini ilişkili değer rozetlerine çevirir. 
 *  NE YAPAR (özet):
 *  Virgülle ayrılmış rowId'ler, verilen hücre listesinden eşleşen değerlere
 *  (label) çözülüp rozet olarak gösterilir; uzun etiketler kırpılır.
 *  İlişkili etiket çözümü gizlenmiştir. 
 */
export const ForeignCell = (_props: CellProps): JSX.Element => {
  throw new Error("Source available on request.");
};
