import { AccessLevel, Datatable } from "common/data/Datatable";
import { IResult } from "common/data/iResult";
import { TableCell } from "common/data/TableCell";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { DataType } from "common/enums/DataType";
import { ModalSizeType } from "common/enums/ModalSizeType";
import { FileManagerRef } from "pages/Crm/DatatableItem/RenderCellInput/components/FileInput";
import { TableAccessResponse } from "pages/Crm/Datatables/Settings/EditTableAccess/hooks/useTableAccessForm";
import { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";

export interface DataTableItemContextType { 
    // Tablo ve Satır Verileri (State)
    table: Datatable | undefined;
    setTable: Dispatch<SetStateAction<Datatable | undefined>>;
    tableItem: Datatable | undefined;
    setTableItem: Dispatch<SetStateAction<Datatable | undefined>>;
    row: TableRow;
    setRow: Dispatch<SetStateAction<TableRow>>;
    
    // Modal Durumları
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    modalType: DataType;
    setModalType: Dispatch<SetStateAction<DataType>>;
    toggle: () => void;
    
    // Seçim ve Silme Mantığı
    selectedCheckBoxDelete: any[];
    setSelectedCheckBoxDelete: Dispatch<SetStateAction<any[]>>;
    isMultiDeleteButton: boolean;
    setIsMultiDeleteButton: Dispatch<SetStateAction<boolean>>;
    isAllDatas: number;
    setIsAllDatas: Dispatch<SetStateAction<number>>;
    deleteCheckbox: () => void;
    checkedAll: () => void;

    columns: TableColumn[];
    rows: TableRow[];
    deletedRows: TableRow[];
    tableAndRows: IResult<Datatable[]> | undefined;
    cells: {  [columnId: number]: TableCell[]; };
    datatable: IResult<Datatable>; 
    tableRows: IResult<TableRow[]>;
    tableColumns: IResult<TableColumn[]>;
    deletedTableRows: IResult<TableRow[]>;
    tableRow: IResult<TableRow>;

    // Loading & Error States
    isTableColumnsLoading: boolean;
    tableColumnsError: any;
    isTableRowsLoading: boolean;
    tableRowsError: any;
    isDeletedTableRowsLoading: boolean;
    deletedTableRowsError: any;
    isTableLoading: boolean;
    tableError: any;
    isTableRowLoading: boolean;
    tableRowErrors: any;

    // Dosya Yönetimi
    loading: { [key: string]: boolean[] };
    setLoading: Dispatch<SetStateAction<{ [key: string]: boolean[] }>>;
    selectedFile: { [key: string]: File[] };
    setSelectedFile: Dispatch<SetStateAction<{ [key: string]: File[] }>>;
    selectedForDeletion: { [key: string]: string[] };
    setSelectedForDeletion: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
    fileManagerRefs: MutableRefObject<{ [key: string]: RefObject<FileManagerRef> | null }>;
    filteredFileIds: number[];

    // Hooklardan Gelen Diğer Aksiyonlar
    dynamicGlobalStyles: string;
    tableDeletedData: any[];
    tableData: any[];
    cols: any[];
    deleteModalMulti: boolean;
    setTableDeleteModalMulti: Dispatch<SetStateAction<boolean>>;
    deleteTableMultiple: () => void;
    deleteCheckedRow: () => Promise<void>;
    isExportCSV: boolean;
    setIsExportCSV: Dispatch<SetStateAction<boolean>>;
    exportToCsv: () => void;

    foreignRows:  { [rowId: number]: TableCell[]; };
    sortedCols: TableColumn[];
    rowId: number;
    pageType: DataType;
    modalSize: ModalSizeType;
    isSmallModal: boolean;
    isFullModal: boolean;
    effectiveRowId: number; 
    access: TableAccessResponse | undefined;
}