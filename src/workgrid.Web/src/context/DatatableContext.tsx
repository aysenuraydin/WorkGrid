import React, { createContext, useContext, useState } from 'react';
import { DataTableContextType } from 'components/Common/interfaces/DataTableContextType';

const DataTableContext = createContext<DataTableContextType>({} as DataTableContextType); 
export const DataTableProvider = ({ children }: { children: React.ReactNode }) => {
    // 🔒 Hidden. Onlarca alt hook (useModalState/useTabState/usePendingState/
    //   useDatatableActions/useSaveAll/useDatatableColumns/useRelationships)
    //   birleştirilip DataTableContext.Provider value olarak sağlanır.
    throw new Error("Source available on request.");
};

export const useDataTable = () => {
    const context = useContext(DataTableContext);
    if (!context) throw new Error("useDataTable sadece DataTableProvider içinde kullanılabilir!");
    return context;
};