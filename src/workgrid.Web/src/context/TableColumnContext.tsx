import React, { createContext, useContext } from 'react';
import { TableColumnContextType } from 'components/Common/interfaces/TableColumnContextType';

const TableColumnContext = createContext<TableColumnContextType>({} as TableColumnContextType); 
export const TableColumnProvider = ({ children }: { children: React.ReactNode }) => {
    // 🔒 Hidden. useColumnActions/useColumnOrdering/useColumnPersistence + yerel
    //   state (columns/deletedColumns/initialColumnsRef/visibleColumns) birleştirilir.
    throw new Error("Source available on request.");
};

export const useTableColumn = () => {
    const context = useContext(TableColumnContext);
    if (!context) throw new Error("useTableColumn sadeceTableColumnProvider içinde kullanılabilir!");
    return context;
};