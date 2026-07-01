import { 
    getTables as onGetTables, 
    getDatatables as getDatatables,
    getDatatableRelationships as getDatatableRelationships, 
    deleteDatatableById,
    createDatatable,
    updateDatatable,
    updateForeignTable as onUpdateForeignTable, 
    restoreDatatableById,
    getDeletedDataTables, 
    changeTableHeight as onChangeTableHeight, 
    hardDeleteDatatableById,
    getTableById,
    deleteBulkDatatableByIds,
    hardDeleteBulkDatatableByIds,
    updateTableAccess,
    getTableAccess, 
} from "../../src/helpers/backend_helper";
import { ForeignTable } from "common/data/ForeignTable";
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';  
import { IResult } from "common/data/iResult";
import { Datatable, SetTableAccessRequest } from "common/data/Datatable";

const invalidateTableQueries = (queryClient: QueryClient, id?: number) => {
    queryClient.invalidateQueries({ queryKey: ["GetDataTables"] });
    queryClient.invalidateQueries({ queryKey: ["GetTables"] }); 

    if (id) {
        queryClient.invalidateQueries({ queryKey: ['GetTable', id] });
    }
};
const invalidateTablePluginQueries = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["GetDeletedDataTables"] });
    queryClient.invalidateQueries({ queryKey: ["GetDatatablesRelationships"] }); 
};

//! exact: true // Sadece bu GetTableRows ile başlayanları sil, şüpheye yer bırakma
//! queryClient.removeQueries(); // Hafızayı tamamen boşaltır, bir sonraki istekte her şey sıfırdan çekilir.
//! staleTime: 5000, // 5 saniye sonra veriyi "eski" kabul et //varsayılan olarak 5 dakika zaten
//! gcTime: 1000 * 60, // 1 dakika sonra cache'ten tamamen sil 

export const useGetDataTables = () => {
    return useQuery<IResult<Datatable[]>>({
        queryKey: ['GetDataTables'],
        queryFn: async () => await getDatatables() as unknown as IResult<Datatable[]>
    });
}; 
export const useGetTables = () => {
    return useQuery<IResult<Datatable[]>>({
        queryKey: ['GetTables'], 
        queryFn: async () => await onGetTables() as unknown as IResult<Datatable[]>
    });
};  
export const useGetDeletedDataTables = () => {
    return useQuery<IResult<Datatable[]>>({
        queryKey: ['GetDeletedDataTables'],  
        queryFn: async () => await getDeletedDataTables() as unknown as IResult<Datatable[]> 
    });
}; 
export const useGetDatatablesRelationships = () => {
    return useQuery<IResult<Datatable[]>>({
        queryKey: ['GetDatatablesRelationships'], 
        queryFn: async () => await getDatatableRelationships() as unknown as IResult<Datatable[]>  
    });
};
export const useGetTable = (id: number) => {
    return useQuery<IResult<Datatable>>({
        queryKey: ['GetTable', id],  
        queryFn: async () => await getTableById(id) as unknown as IResult<Datatable> , 
        enabled: !!id, 
    });
}; 
export const useCreateDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (table: any) => createDatatable(table),
        onSuccess: () => { 
            invalidateTableQueries(queryClient); 
            queryClient.invalidateQueries({ queryKey: ["GetDatatablesRelationships"] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useUpdateDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (table: any) => updateDatatable(table),
        onSuccess: (_,table) => { 
            invalidateTableQueries(queryClient, table?.id);   
            queryClient.invalidateQueries({ queryKey: ["GetDatatablesRelationships"] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useUpdateForeignDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (item:{id:number, foreignTablesFk:ForeignTable[]}) => onUpdateForeignTable(item),
        onSuccess: (_,item) => { 
            queryClient.invalidateQueries({ queryKey: ["GetTable",item.id] });
            queryClient.invalidateQueries({ queryKey: ["GetTables"] });
            queryClient.invalidateQueries({ queryKey: ["GetDataTables"] });
            queryClient.invalidateQueries({ queryKey: ["GetDatatablesRelationships"] });
            queryClient.invalidateQueries({ queryKey: ["GetTableColumns",item.id] });
            queryClient.invalidateQueries({ queryKey: ["GetDatatableColumns",item.id] });
            queryClient.invalidateQueries({ queryKey: ["GetTableRows",item.id] });
            queryClient.invalidateQueries({ queryKey: ["GetDatatableRows",item.id] });
            invalidateTablePluginQueries(queryClient); 
            invalidateTableQueries(queryClient, item.id);   
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });   
};
export const useChangeTableHeight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (table: any) => onChangeTableHeight(table),
        onSuccess: (_,table) => { 
            invalidateTableQueries(queryClient, table?.id); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useRestoreDeleteDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id:number) => restoreDatatableById(id),
        onSuccess: (_,id) => { 
            invalidateTableQueries(queryClient, id);  
            invalidateTablePluginQueries(queryClient); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useHardDeleteDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id:number) => hardDeleteDatatableById(id),
        onSuccess: () => {  
            invalidateTablePluginQueries(queryClient); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useDeleteDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id:number) => deleteDatatableById(id),
        onSuccess: (_,id) => { 
            invalidateTableQueries(queryClient, id); 
            invalidateTablePluginQueries(queryClient); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 

export const useDeleteBulkDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids:number[]) => deleteBulkDatatableByIds(ids),
        onSuccess: (_,ids) => { 
            ids.forEach(i => {
                invalidateTablePluginQueries(queryClient);  
                invalidateTableQueries(queryClient, i);  
            }); 
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
}; 
export const useHardDeleteBulkDataTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: number[]) => hardDeleteBulkDatatableByIds(ids),
        onSuccess: async (_, ids) => {  
            queryClient.invalidateQueries({ queryKey: ["GetDataTables"] });
            queryClient.invalidateQueries({ queryKey: ["GetTables"] });
            queryClient.invalidateQueries({ queryKey: ["GetDeletedDataTables"] });
            queryClient.invalidateQueries({ queryKey: ["GetDatatablesRelationships"] });

            if (ids && ids.length > 0) {
                ids.forEach(id => {
                    queryClient.invalidateQueries({ queryKey: ['GetTable', id] });
                });
            }
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};
export const useGetTableAccess = (id?: number) => {
    return useQuery({
        queryKey: ["GetTableAccess", id],
        queryFn: async () => {
            const res = await getTableAccess(id!);
            return res?.data?.data ?? res?.data;
        },
        enabled: !!id,   
    });
};
export const useUptadeTableAccess = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (value: SetTableAccessRequest) => updateTableAccess(value),
        onSuccess: (_, value) => {
            invalidateTableQueries(queryClient, value?.id);
            queryClient.invalidateQueries({ queryKey: ["GetDatatablesRelationships"] });
        },
        onError: (err: any) => {
            console.error("Hata:", err);
        }
    });
};