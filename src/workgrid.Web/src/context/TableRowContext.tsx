import React, { createContext, useContext } from 'react';
import { Datatable } from 'common/data/Datatable';
import { TableRowContextType } from 'components/Common/interfaces/TableRowContextType';

const TableRowContext = createContext<TableRowContextType>({} as TableRowContextType);

interface TableRowProviderProps {
    children: React.ReactNode;
    table: Datatable;
} 
export const TableRowProvider = ({ children, table }: TableRowProviderProps) => {
    // 🔒 Hidden. useEditRowsData/useEditRowsFiles/useEditRowsForm/useEditRowsActions/
    //   useEditRowsCols/useEditRowsFlatRows birleştirilip context value olarak sağlanır.
    throw new Error("Source available on request.");
};

export const useTableRow = () => {
    const context = useContext(TableRowContext);
    if (!context) throw new Error("useTableRow sadeceTableRowProvider içinde kullanılabilir!");
    return context;
};