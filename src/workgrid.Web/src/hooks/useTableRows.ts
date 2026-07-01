import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    getDeletedTableRowsByTableId,  
    getTableRowsById,
    getTableRowsByTableId, 
    hardDeleteRowById,  
    getDatatableRowsByTableId,
    deleteTableRowsById, 
    createTableRow, 
    getDatatableRowsByColumnId,
    getForeignTableRowByCellId,
    restoreDeletedTableRowById,  
    hardDeleteBulkTableRowById,
    restoreBulkDeletedTableRowById,
    deleteBulkTableRowById,
    createBulkTableRow, 
    getForeignTableRowByTableId,
} from "../../src/helpers/backend_helper"; 
import { TableRow } from 'common/data/TableRow';
import { IResult } from 'common/data/iResult';
import { Datatable } from 'common/data/Datatable';

export const invalidateTableRows = (queryClient: QueryClient, tableId: number) => {
    queryClient.invalidateQueries({ queryKey: ["GetTableRows", tableId] });
    queryClient.invalidateQueries({ queryKey: ["GetDatatableRows", tableId] });
    queryClient.invalidateQueries({ queryKey: ["GetDeletedTableRows", tableId] });
};

export const useGetTableRows = (id: number) => {
    return useQuery<IResult<TableRow[]>>({
        queryKey: ['GetTableRows', id], 
        queryFn: async () => await getTableRowsByTableId(id) as unknown as IResult<TableRow[]>, 
        enabled: !!id, 
    });
}; 
export const useGetDatatableRows = (id: number) => {
    return useQuery<IResult<TableRow[]>>({
        queryKey: ['GetDatatableRows', id], 
        queryFn: async () => await getDatatableRowsByTableId(id) as unknown as IResult<TableRow[]>, 
        enabled: !!id, 
    }); 
};
export const useGetDatatableRowsByColumnId = (id: number) => {
    return useQuery<IResult<TableRow[]>>({
        queryKey: ['GetDatatableRowsByColumnId', id], 
        queryFn: async () => await getDatatableRowsByColumnId(id) as unknown as IResult<TableRow[]>, 
        enabled: !!id, 
    });
};
export const useGetDeletedTableRows = (id: number | undefined) => {
    return useQuery<IResult<TableRow[]>>({
        queryKey: ['GetDeletedTableRows', id], 
        queryFn: async () => await getDeletedTableRowsByTableId(id!) as unknown as IResult<TableRow[]>, 
        enabled: typeof id === 'number' && !isNaN(id),
    }); 
};
export const useGetTableRow = (id: number) => {
    return useQuery<IResult<TableRow>>({
        queryKey: ['GetTableRow', id], 
        queryFn: async () => await getTableRowsById(id) as unknown as IResult<TableRow>, 
        enabled: !!id, 
    });
};
export const useGetForeignTableRowByCellId = (item:{cellId:number, realRowId:number}) => {
    return useQuery<IResult<TableRow>>({
        queryKey: ['GetForeignTableRowByCellId', item.realRowId], 
        queryFn: async () => await getForeignTableRowByCellId(item.cellId, item.realRowId) as unknown as IResult<TableRow>, 
        enabled: !!item.cellId && !!item.realRowId,
    });
};
export const useGetForeignTableRowByTableId = (tableId:number) => {
    return useQuery<IResult<Datatable[]>>({
        queryKey: ['GetForeignTableRowByTableId', tableId], 
        queryFn: async () => await getForeignTableRowByTableId(tableId) as unknown as IResult<Datatable[]>, 
        enabled: !!tableId,
    });
};  
export const useCreateTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (row: any) => createTableRow(row),
        onSuccess: (_,row) => { 
            // queryClient.invalidateQueries({ 
            //     queryKey: ["GetTableRows",row.tableId] 
            //     exact: false //! Bu, GetTableRows ile başlayan her şeyi yeniler
            // });
            queryClient.invalidateQueries({ queryKey: ["GetTableRows", Number(row.id)] });
            queryClient.invalidateQueries({ queryKey: ["datatableCellsByTableId", Number(row.id)] });
            queryClient.invalidateQueries({ queryKey: ["GetDatatableRows", Number(row.id)] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useRestoreDeletedTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tableId }: { id: number; tableId: number }) => restoreDeletedTableRowById(id),
        onSuccess: (_, { id, tableId }) => { 
            queryClient.invalidateQueries({ queryKey: ["GetTableRow",id] });
            invalidateTableRows(queryClient, tableId);
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useDeleteTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tableId }: { id: number; tableId: number }) => deleteTableRowsById(id),
        onSuccess: (_,{ id, tableId }) => { 
            queryClient.invalidateQueries({ queryKey: ["GetTableRow",id] });
            invalidateTableRows(queryClient, tableId);
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useHardDeleteTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, tableId }: { id: number; tableId: number }) => hardDeleteRowById(id),
        onSuccess: (_,{ id, tableId }) => { 
            queryClient.invalidateQueries({ queryKey: ["GetTableRow",id] }); 
            queryClient.invalidateQueries({ queryKey: ["GetDeletedTableRows",tableId] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};



export const useCreateBulkTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({rows, tableId}:{rows:any, tableId:number}) => createBulkTableRow(rows,tableId),
        onSuccess: (_,{rows, tableId}) => { 
            queryClient.invalidateQueries({ queryKey: ["GetTableRows",tableId] });
            queryClient.invalidateQueries({ queryKey: ["GetDatatableRows",tableId] });
            queryClient.invalidateQueries({ queryKey: ["datatableCellsByColumnId"] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useDeleteBulkTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ids, tableId}:{ids:any, tableId:number}) => deleteBulkTableRowById(ids,tableId),
        onSuccess: (_,{ids, tableId}) => { 
            invalidateTableRows(queryClient, tableId); 
            // queryClient.invalidateQueries({ queryKey: ["GetTableRows",tableId] });
            // queryClient.invalidateQueries({ queryKey: ["GetDatatableRows",tableId] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useRestoreBulkTableRow = () => { 
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({rows, tableId}:{rows:any, tableId:number}) => restoreBulkDeletedTableRowById(rows,tableId),
        onSuccess: (_,{rows, tableId}) => {  
            invalidateTableRows(queryClient, tableId);
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useHardDeleteBulkTableRow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ids, tableId}:{ids:any, tableId:number}) => hardDeleteBulkTableRowById(ids,tableId),
        onSuccess: (_,{ids, tableId}) => {  
            invalidateTableRows(queryClient, tableId);
            if (ids && ids.length > 0) {
                ids.forEach((id:any) => {
                    queryClient.invalidateQueries({ queryKey: ["GetTableRow",id] }); 
                });
            } 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
