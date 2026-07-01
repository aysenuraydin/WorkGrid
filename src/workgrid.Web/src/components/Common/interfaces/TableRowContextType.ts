// import { Datatable } from "common/data/Datatable";
// import { TableCell } from "common/data/TableCell";
// import { TableColumn } from "common/data/TableColumn";
// import { TableRow } from "common/data/TableRow";
// import { UpdateItem } from "pages/Crm/Datatables/components/Datatables";
// import { Dispatch, MutableRefObject, SetStateAction } from "react";

// export interface FormValues {
//     cells: Record<number, Record<number, any>>; 
// }  
// export interface FileData {
//     loadings: { [key: string]: boolean[] };
//     selectedFiles: { [key: string]: File[] };
//     deletions: { [key: string]: string[] };
// }
// export type TableRowWithStatus = TableRow & { isAdded?: boolean; isSuccess?: boolean };

// export interface TableRowContextType { 
//     openAlertModal: boolean;
//     setOpenAlertModal: Dispatch<SetStateAction<boolean>>;
//     isTablesColumnsLoading: boolean;
//     isTablesRowsLoading: boolean;
//     tablesRowsError: any;
    
//     rows: { [tableId: number]: TableRowWithStatus[] };
//     setRows: Dispatch<SetStateAction<{ [tableId: number]: TableRowWithStatus[] }>>;
//     columns: { [tableId: number]: TableColumn[] };
//     tables: { [tableId: number]: Datatable };
//     foreignRows: { [rowId: number]: TableCell[] };
//     cells: { [columnId: number]: TableCell[] };
    
//     fileDataRef: MutableRefObject<FileData>;
//     fileManagerRefs: MutableRefObject<{ [key: string]: any }>;
//     fileColIds: number[];
//     uploadAllFiles: (rowId: number) => Promise<{ [key: string]: string }>;
//     deletePendingFiles: () => Promise<void>;
//     buildFinalFileValue: (original: string, uploaded?: string, deleted?: string[]) => string;
    
//     formik:any
//     formikRef: MutableRefObject<any>;
//     formikValuesRef: MutableRefObject<any>;
//     initialValues: FormValues;
//     pendingUpdates: { [tableId: number]: { [cellId: number]: UpdateItem } };
//     setPendingUpdates: Dispatch<SetStateAction<{ [tableId: number]: { [cellId: number]: UpdateItem } }>>;
//     pendingUpdatesRef: MutableRefObject<{ [cellId: number]: UpdateItem } | undefined>;
//     handleChange: (
//         value: any,
//         colId: number,
//         rowId: number,
//         cellId: number,
//         relatedCols?: any[],
//         rowsString?: string
//     ) => void;
    
//     deleteRow: (rowId: number) => Promise<void>;
//     deleteCheckbox: () => void;
//     onSubmit: () => Promise<void>;
    
//     cols: any[]; 
//     checkedAll: () => void;
    
//     flatRows: any[];
//     bulkDeleteCheckedRows: () => Promise<void>;

//     cellsByColumIds : any;
//     isCellsLoading : boolean;
//     cellsError :any;
// }


import { Datatable } from "common/data/Datatable";
import { TableCell } from "common/data/TableCell";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { UpdateItem } from "pages/Crm/Datatables/components/Datatables";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export interface FormValues {
    cells: Record<number, Record<number, any>>;
}
export interface FileData {
    loadings: { [key: string]: boolean[] };
    selectedFiles: { [key: string]: File[] };
    deletions: { [key: string]: string[] };
}
export type TableRowWithStatus = TableRow & { isAdded?: boolean; isSuccess?: boolean };

export interface TableRowContextType {
    openAlertModal: boolean;
    setOpenAlertModal: Dispatch<SetStateAction<boolean>>;

    // ── Loading flag'leri (hepsi useEditRowsData'dan) ──
    isTablesColumnsLoading: boolean;
    isTablesRowsLoading: boolean;
    isCellsLoading: boolean;            // hucre verisi yukleniyor mu
    isTableAndRowsLoading: boolean;     // foreign (ayna) satirlari yukleniyor mu
    tablesRowsError: any;

    rows: { [tableId: number]: TableRowWithStatus[] };
    setRows: Dispatch<SetStateAction<{ [tableId: number]: TableRowWithStatus[] }>>;
    columns: { [tableId: number]: TableColumn[] };
    tables: { [tableId: number]: Datatable };
    foreignRows: { [rowId: number]: TableCell[] };
    cells: { [columnId: number]: TableCell[] };

    fileDataRef: MutableRefObject<FileData>;
    fileManagerRefs: MutableRefObject<{ [key: string]: any }>;
    fileColIds: number[];
    uploadAllFiles: (rowId: number) => Promise<{ [key: string]: string }>;
    deletePendingFiles: () => Promise<void>;
    buildFinalFileValue: (original: string, uploaded?: string, deleted?: string[]) => string;

    formik: any;
    formikRef: MutableRefObject<any>;
    formikValuesRef: MutableRefObject<any>;
    initialValues: FormValues;
    pendingUpdates: { [tableId: number]: { [cellId: number]: UpdateItem } };
    setPendingUpdates: Dispatch<SetStateAction<{ [tableId: number]: { [cellId: number]: UpdateItem } }>>;
    pendingUpdatesRef: MutableRefObject<{ [cellId: number]: UpdateItem } | undefined>;
    handleChange: (
        value: any,
        colId: number,
        rowId: number,
        cellId: number,
        relatedCols?: any[],
        rowsString?: string
    ) => void;

    deleteRow: (rowId: number) => Promise<void>;
    deleteCheckbox: () => void;
    onSubmit: () => Promise<void>;

    cols: any[];
    checkedAll: () => void;

    flatRows: any[];
    bulkDeleteCheckedRows: () => Promise<void>;
}