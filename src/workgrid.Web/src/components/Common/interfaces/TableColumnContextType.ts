import { TableColumn } from "common/data/TableColumn";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export type ExtendedTableColumn = TableColumn & { 
    isAdded: boolean; 
    isDeleted: boolean; 
    deletedAt?: string; 
}; 

export type DeletedTableColumn = TableColumn & { 
    isBackDeleted: boolean; 
    isHardDelete: boolean; 
    deletedAt: string; 
}; 

export interface TableColumnContextType {
    columns: ExtendedTableColumn[];
    setColumns: Dispatch<SetStateAction<ExtendedTableColumn[]>>;
    
    isMove: Record<string, boolean>; 
    setIsMove: Dispatch<SetStateAction<Record<string, boolean>>>;
    
    deletedColumns: DeletedTableColumn[];
    setDeletedColumns: Dispatch<SetStateAction<DeletedTableColumn[]>>;
    
    isAllDatas: number;
    setIsAllDatas: Dispatch<SetStateAction<number>>;

    initialColumnsRef: MutableRefObject<ExtendedTableColumn[]>; 
    visibleColumns: ExtendedTableColumn[];
    scrollRef: MutableRefObject<HTMLDivElement | null>;

    markToBeEdited: (col: Partial<ExtendedTableColumn> & { id: number }) => void;
    markToBeAdded: (newColumn: Partial<TableColumn>) => void;
    markToBeDeleted: (column: ExtendedTableColumn) => void;  

    hardDeleteTableColumn: (column: DeletedTableColumn) => Promise<void>;  
    backToDeleteColumn: (column: DeletedTableColumn) => void; 
    handleSaveAll: () => Promise<void>;

    moveUp: (columnId: number) => void;
    moveDown: (columnId: number) => void;
    resetOrder: () => void;
    confirmOrder: () => void;
}