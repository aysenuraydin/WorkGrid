import { IDataAudit } from "./IDataAudit";
import { TableCell } from "./TableCell";


export interface TableRow extends IDataAudit {
  id: number;
  tableId: number;
  cellsFk: TableCell[];
}

export interface TableRowDto {
  id: number;
  tableId: number;
  cellsFk: TableCell[]; 
}


