import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { 
    getTableColumnsByTableId, 
    getDatatableColumnsByTableId,
    createTableColumn,
    createBulkTableColumn, 
    updateTableColumn,
    updateColumnWithDesign,
    updateTableColumnWithOption,
    updateTableColumnWithValidation,
    updateTableColumnWithModal,
    updateTableColumnWithFunction,
    updateBulkTableColumn,
    updateBulkColumnWithDesign,
    updateBulkTableColumnWithOption,
    updateBulkTableColumnWithValidation,
    updateBulkTableColumnWithModal,
    updateBulkTableColumnWithFunction, 
    restoreDeletedTableColumnById,
    hardDeleteColumnById,
    getDeletedTableColumnsByTableId, 
    deleteBulkTableColumnById,
    restoreBulkDeletedTableColumnById, 
    hardDeleteBulkTableColumnById,
    deleteTableColumnById,
    getAllTableColumns, 
} from "../../src/helpers/backend_helper"; 
import { IResult } from 'common/data/iResult';
import { TableColumn } from 'common/data/TableColumn';

const invalidateTableQueries = (queryClient: QueryClient, tableId: number) => {
    queryClient.invalidateQueries({ queryKey: ["GetTableColumns", tableId] });
    queryClient.invalidateQueries({ queryKey: ["GetAllTableColumns"] });
    queryClient.invalidateQueries({ queryKey: ["GetDatatableColumns", tableId] });
    queryClient.invalidateQueries({ queryKey: ["GetDeletedTableColumns", tableId] });
};

export const useGetAllTableColumns = () => {
    return useQuery<IResult<any[]>>({
        queryKey: ['GetAllTableColumns'], 
        queryFn: async () => await getAllTableColumns()  as unknown as IResult<any[]>
    });
};
export const useGetTableColumns = (id: number) => {
    return useQuery<IResult<TableColumn[]>>({
        queryKey: ['GetTableColumns', id], 
        queryFn: async () => await getTableColumnsByTableId(id) as unknown as IResult<TableColumn[]>,
        enabled: !!id, 
    });
};  
export const useGetDatatableColumns = (id: number) => {
    return useQuery<IResult<TableColumn[]>>({
        queryKey: ['GetDatatableColumns', id], 
        queryFn: async () => await getDatatableColumnsByTableId(id) as unknown as IResult<TableColumn[]>,
        enabled: !!id, 
    });
};
export const useDeletedTableColumns = (id: number) => {
    return useQuery<IResult<TableColumn[]>>({
        queryKey: ['GetDeletedTableColumns', id], 
        queryFn: async () => await getDeletedTableColumnsByTableId(id) as unknown as IResult<TableColumn[]>,
        enabled: !!id, 
    });
};

export const useCreateTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (col: any) => createTableColumn(col),
        onSuccess: (_,col) => {  
            if (col.tableId) invalidateTableQueries(queryClient, col.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useUpdateTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (col: any) => updateTableColumn(col),
        onSuccess: (_,col) => {  
            if (col.tableId) invalidateTableQueries(queryClient, col.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useColumnWithDesign = () => { 
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (col: any) => updateColumnWithDesign(col),
        onSuccess: (_,col) => {  
            if (col.tableId) invalidateTableQueries(queryClient, col.tableId); 
        }, 
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useColumnWithOption = () => {  
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (col: any) => updateTableColumnWithOption(col),
        onSuccess: (_,col) => {  
            console.log("Satır eklendi");
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useColumnWithValidation = () => {  
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (col: any) => updateTableColumnWithValidation(col),
        onSuccess: (_,col) => {  
            if (col.tableId) invalidateTableQueries(queryClient, col.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useColumnWithModal = () => {  
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (col: any) => updateTableColumnWithModal(col),
        onSuccess: (_,col) => {  
            if (col.tableId) invalidateTableQueries(queryClient, col.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useColumnWithFunction = () => {  
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (col: any) => updateTableColumnWithFunction(col),
        onSuccess: (_,col) => {  
            if (col.tableId) invalidateTableQueries(queryClient, col.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};

export const useDeleteTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tableId }: { id: number; tableId: number }) => deleteTableColumnById(id),
        onSuccess: (_,{ id, tableId }) => { 
            invalidateTableQueries(queryClient, tableId);
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useRestoreTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tableId }: { id: number; tableId: number }) => restoreDeletedTableColumnById(id),
        onSuccess: (_,{ id, tableId }) => { 
            invalidateTableQueries(queryClient, tableId);
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useHardDeleteTableColumn = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({ id, tableId }: { id: number; tableId: number }) => hardDeleteColumnById(id),
        onSuccess: (_,{ id, tableId }) => {  
            queryClient.invalidateQueries({ queryKey: [tableId] }); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};


export const useCreateBulkTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({columns, tableId}:{columns:any, tableId:number}) => createBulkTableColumn({columns,tableId}),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useUpdateBulkTableColumn = () => { 
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({columns,tableId}:{columns:any, tableId:number}) => updateBulkTableColumn({columns, tableId}),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useUpdateBulkTableColumnWithDesign = () => { 
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({columns,tableId}:{columns:any, tableId:number}) => 
            updateBulkColumnWithDesign(columns, tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useUpdateBulkTableColumnWithOption = () => { 
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({columns,tableId}:{columns:any, tableId:number}) => 
            updateBulkTableColumnWithOption(columns, tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useUpdateBulkTableColumnWithValidation = () => { 
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({columns,tableId}:{columns:any, tableId:number}) => 
            updateBulkTableColumnWithValidation(columns, tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};

export const useUpdateBulkTableColumnWithModal = () => { 
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: (item:{modalHeight:number,columnDesigns:any, tableId:number}) =>  
            updateBulkTableColumnWithModal(item,item.tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useUpdateBulkTableColumnWithFunction = () => { 
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({columns,tableId}:{columns:any, tableId:number}) => 
            updateBulkTableColumnWithFunction(columns, tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};

export const useDeleteBulkTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({columns, tableId}:{columns:any, tableId:number}) => deleteBulkTableColumnById(columns,tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useRestoreBulkTableColumn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ids, tableId}:{ids:any, tableId:number}) => restoreBulkDeletedTableColumnById(ids,tableId),
        onSuccess: (_,item) => { 
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useHardDeleteBulkTableColumn = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: ({ids, tableId}:{ids:any, tableId:number}) => 
            hardDeleteBulkTableColumnById(ids,tableId),
        onSuccess: (_,item) => {  
            invalidateTableQueries(queryClient, item.tableId); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 










