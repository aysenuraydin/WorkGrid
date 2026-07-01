import React, { createContext, useContext } from 'react';
import { DataTableItemContextType } from 'components/Common/interfaces/DataTableItemContextType';

interface DataTableItemProviderProps {
    children: React.ReactNode;
    tableId: number;
}
const DataTableItemContext = createContext<DataTableItemContextType>({} as DataTableItemContextType); 

export const DataTableItemProvider = ({ children, tableId }: DataTableItemProviderProps) => {
    // 🔒 Hidden. Çok sayıda hook (useGetTable*/useCols/useDatas/useTableOperations/
    //   useExportCSV/useForeignRows/useTableModalManager/useModalNavigation vb.) +
    //   yerel state birleştirilip DataTableItemContext value olarak sağlanır.
    throw new Error("Source available on request.");
};

export const useDataTableItem = () => {
    const context = useContext(DataTableItemContext);
    if (!context) throw new Error("useDataTable sadece DataTableProvider içinde kullanılabilir!");
    return context;
};