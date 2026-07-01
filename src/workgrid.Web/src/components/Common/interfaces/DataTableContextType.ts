import { Datatable } from "common/data/Datatable";
import { IResult } from "common/data/iResult";
import { Dispatch, SetStateAction } from 'react';
import { DataType } from 'common/enums/DataType';
import { ActiveTab, TabItem } from "pages/Crm/Datatables/hooks/useTabState";

export interface IDataTableModalState {
    table: Datatable;
    setTable: Dispatch<SetStateAction<Datatable>>;
    modalType: DataType;
    setModalType: Dispatch<SetStateAction<DataType>>;
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    editColumnModal: boolean;
    setEditColumnModal: Dispatch<SetStateAction<boolean>>;  
    editRelationModal: boolean;
    setEditRelationModal: Dispatch<SetStateAction<boolean>>;  
    editSettingModal: boolean;
    setEditSettingModal: Dispatch<SetStateAction<boolean>>; 
    tableToggle: () => void;
    columnToggle: () => void;
    relationToggle: () => void;
    settingToggle: () => void;
    handleTableClick: (arg: any, type: DataType) => void;
    handleEditColumnsClick: (arg?: any) => void;
    handleRowsClick: (arg?: any) => void;
    handleRelationClick: (arg?: any) => void;
    handleSettingClick: (arg?: any) => void; 
}
export interface IDataTableTabState {
    activeTab: ActiveTab;
    tabs: TabItem[];
    setTabs: Dispatch<SetStateAction<TabItem[]>>;
    toggleTab: (tab: { name: string; id?: number }) => void;
    setTabState: (id?: number, value?: boolean) => void;
}
export interface IDataTablePendingState {
    // [tableId]: { [cellId]: value } yapısı
    pendingUpdates: { [tableId: number]: { [cellId: number]: any } };  
    deletedRowIds: { [tableId: number]: number[] };
    changePending: (val: any, tableId: number) => void;
    changeDeleting: (val: any, tableId: number) => void;
    clearPendingUpdatesForTable: (tableId: number) => void;
    getPendingCountForTable: (tableId: number) => number;
}
export interface IDataTableActions {
    isTableMultiDeleteButton: boolean;
    setIsTableMultiDeleteButton: Dispatch<SetStateAction<boolean>>;
    isRowMultiDeleteButton: boolean;
    setIsRowMultiDeleteButton: Dispatch<SetStateAction<boolean>>;
    deleteModalMulti: boolean;
    setTableDeleteModalMulti: Dispatch<SetStateAction<boolean>>;
    checkedAll: () => void;
    deleteCheckbox: () => void;
    deleteCheckedRow: () => Promise<void>;
    deleteTableMultiple: () => void;
    deleteDatatableById: (tableId: number) => Promise<void>;
    backToDelete: (tableId: number) => Promise<void>;
    hardDelete: (tableId: number) => Promise<void>;
}

export interface DataTableContextType {
    // Local States
    isExportCSV: boolean;
    setIsExportCSV: Dispatch<SetStateAction<boolean>>;
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;

    tables: IResult<Datatable[]> | undefined;
    isTablesLoading: boolean;
    tablesError: Error | null;
    deletedtables: IResult<Datatable[]> | undefined;
    isDeletedTablesLoading: boolean;
    deletedTablesError: Error | null;

    // useRelationships'ten Gelenler (İlişki Haritası Verileri)
    tablesRelationships: IResult<Datatable[]> | undefined;
    isTablesRelationshipsLoading: boolean;
    tablesRelationshipsError: Error | null;
    tableList: {
        [id: number]: Datatable & { 
            isSeen: boolean; 
            isOpen: boolean; 
            zIndex: number; 
            x: number; 
            y: number 
        }
    };
    setTableList: Dispatch<SetStateAction<DataTableContextType['tableList']>>;
    
    modal: IDataTableModalState;
    tabState: IDataTableTabState;
    pending: IDataTablePendingState;
    actions: IDataTableActions; 

    handleSaveAll: (id:number) => Promise<void>;
    columns: any;  
}