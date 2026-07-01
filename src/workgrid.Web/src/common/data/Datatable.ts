import { ModalSizeType } from "common/enums/ModalSizeType";
import { ForeignTable } from "./ForeignTable";
import { TableColumn } from "./TableColumn";
import { TableRow } from "./TableRow";
import { TableViewType } from "common/enums/TableViewType";
import { IDataAudit } from "./IDataAudit";

export interface Datatable  extends IDataAudit, SetTableAccessRequest {
  id: number;
  name: string;
  columnsFk: TableColumn[];
  rowsFk: TableRow[];
  foreignTablesFk?: ForeignTable[];
  modalSize?: ModalSizeType;
  modalHeight?: number;
  viewType?: TableViewType;
  pageSize?: number; 
}

export interface SetTableAccessRequest {
    id: number;
    readAccess: AccessLevel;
    writeAccess: AccessLevel;
    readRequiredRole?: string | null;
    writeRequiredRole?: string | null;
}

export enum AccessLevel {
    Public = "Public",
    Authenticated = "Authenticated",
    RoleBased = "RoleBased",
    Owner = "Owner",
}

