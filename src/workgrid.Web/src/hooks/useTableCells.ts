import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    updateTableCell as onUpdateTableCell,
    updateBulkTableCell as onUpdateBulkTableCell,
    getDatatableCellsByColumnId,
    getDatatableCellsByTableId,
    getDatatableFilteredCellsByTableId, 
} from "../helpers/backend_helper";
import { IResult } from 'common/data/iResult';
import { TableCell } from 'common/data/TableCell';

const invalidateCellQueries = (queryClient: QueryClient, tableId: number, rowId: number, columnId?: number) => {
    queryClient.invalidateQueries({ queryKey: ["GetDatatableRows", tableId] });
    queryClient.invalidateQueries({ queryKey: ["GetTableRows", tableId] }); 
    queryClient.invalidateQueries({ queryKey: ["GetTableRow", rowId] }); 
    queryClient.invalidateQueries({ queryKey: ["datatableCellsByColumnId"] });
    queryClient.invalidateQueries({ queryKey: ["GetForeignTableRowByCellId"] }); 
};


export const useDatatableCellsByColumnId = (columnId: number) => {
    return useQuery<IResult<TableCell[]>>({
        queryKey: ['datatableCellsByColumnId', columnId],
        queryFn: async () => await getDatatableCellsByColumnId(columnId) as unknown as IResult<TableCell[]>,  
        enabled: !!columnId,
    });
};
export const useDatatableCells = (tableId: number) => { 
    return useQuery<IResult<{columnId:number, cellsFk:TableCell[]}[]>>({
        queryKey: ['datatableCellsByTableId', tableId],
        queryFn: async () => await getDatatableCellsByTableId(tableId) as unknown as IResult<{columnId:number, cellsFk:TableCell[]}[]>,  
        enabled: !!tableId, 
    });
};
export const useDatatableFilteredCells = (tableId: number) => { 
    return useQuery<IResult<{columnId:number, cellsFk:TableCell[]}[]>>({
        queryKey: ['datatableFilteredCells', tableId],
        queryFn: async () => await getDatatableFilteredCellsByTableId(tableId) as unknown as IResult<{columnId:number, cellsFk:TableCell[]}[]>,  
        enabled: !!tableId, 
    }); ""
};

export const useUpdateTableCell = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cellId, value, tableId, rowId}: { cellId: number; value: string, tableId:number, rowId:number  }) => 
            onUpdateTableCell({ cellId, value }),
            onSuccess: (_,item) => {
                queryClient.invalidateQueries({ 
                    // Sadece 'datatableCells' anahtarını içeren tüm sorguları yeniler
                    queryKey: ['datatableCells'] ,
                    // exact: false //! Bu, datatableCells ile başlayan her şeyi yeniler
                });
                invalidateCellQueries(queryClient, item.tableId, item.rowId);
            },
    });
};

export const useUpdateBulkTableCell = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cells: { cellId: number; value: string, tableId:number, rowId:number, colId?:number }[]) => 
            onUpdateBulkTableCell(cells),
            onSuccess: (_,items) => {  
                queryClient.invalidateQueries({  queryKey: ['datatableCellsByTableId',items?.[0].tableId] }); 

                items.forEach(i => {
                    invalidateCellQueries(queryClient, i.tableId, i.rowId, i.colId);
                });
            },
        });
};



/*
    export const useTableColumns3 = (id: number) => {
        return useQuery({
            queryKey: ['tableColumns', id],
            queryFn: () => getTableColumnsByTableId(id),
            
            // --- TEMEL KONTROL ---
            enabled: !!id, // Sadece id varsa sorguyu çalıştırır (otomatik tetiklemeyi yönetir)
            
            // --- ÖNBELLEK VE TAZELİK (CACHING) ---
            staleTime: 30000, // Verinin ne kadar süre "taze" kabul edileceği (ms). Bu süre dolana kadar arka plan fetch'i tetiklenmez.
            gcTime: 600000,   // (Garbage Collection) Veri kullanılmadığında (inactive) önbellekte ne kadar tutulacağı (varsayılan 5 dk).
            
            // --- YENİDEN FETCH AYARLARI ---
            refetchOnWindowFocus: false,   // Kullanıcı başka sekmeden uygulamaya döndüğünde otomatik yenilemeyi kapatır.
            refetchOnMount: true,         // Bileşen her mount olduğunda veriyi kontrol eder (varsayılan true).
            refetchInterval: false,       // Belirli periyotlarla (ms) arka planda otomatik yenileme yapar (canlı veriler için).
            
            // --- HATA VE YÜKLEME YÖNETİMİ ---
            retry: 1,                     // Hata durumunda kaç kez yeniden deneneceği (false: hiç deneme).
            retryDelay: 1000,             // Yeniden denemeler arasındaki bekleme süresi (ms).
            
            // --- DATA DÖNÜŞÜMÜ VE PERFORMANS ---
            select: (data) => data.data,  // API'den dönen tüm response içinden sadece ihtiyacımız olan kısmı (data) ayıklar.
            placeholderData: (previousData) => previousData, // Yeni veri yüklenirken eski veriyi ekranda tutar (layout kaymasını önler).
        });
    };
*/



