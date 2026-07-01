import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllRows,
    getOneRow,
    getPagedRows,
    getRowById,
    createRow,
    updateRow,
    deleteRow,
    patchRow,
    type GridbaseQuery,
    getAllTables,
    getOneTable,
    getGTableById,
    createTable,
    updateTable,
    deleteTable,
    getEmptyColumns,
    pruneEmptyColumns,
    deleteColumn,
    setTableAccess,
} from "helpers/backend_helper";

// Query Keys
export const gridbaseAllKey = (tableName: string, params?: GridbaseQuery) =>
    ["gridbase", tableName, "all", params ?? {}] as const;
export const gridbaseOneKey = (tableName: string, params?: GridbaseQuery) =>
    ["gridbase", tableName, "one", params ?? {}] as const;
export const gridbasePagedKey = (tableName: string, params?: object) =>
    ["gridbase", tableName, "paged", params] as const;
export const gridbaseRowKey = (tableName: string, id: number, params?: object) =>
    ["gridbase", tableName, id, params ?? {}] as const;

export const gridbaseTablesAllKey = (params?: object) =>
    ["gridbase", "tables", "all", params ?? {}] as const;
export const gridbaseTableOneKey = (params?: object) =>
    ["gridbase", "tables", "one", params ?? {}] as const;
export const gridbaseTableByIdKey = (id: number) =>
    ["gridbase", "tables", id] as const;
export const gridbaseEmptyColumnsKey = (tableId: number) =>
    ["gridbase", "tables", tableId, "empty-columns"] as const;

// GET ALL  (filter / sort / select destekli)
export const useGridbaseAll = <T = any>(tableName: string, params?: GridbaseQuery) =>
    useQuery<T[]>({
        queryKey: gridbaseAllKey(tableName, params),
        queryFn: () => getAllRows(tableName, params),
        enabled: !!tableName,
    });

// GET ONE  (tek kayıt — filter ile bulur)
export const useGridbaseOne = <T = any>(
    tableName: string,
    params?: GridbaseQuery,
    options?: { enabled?: boolean }
) =>
    useQuery<T>({
        queryKey: gridbaseOneKey(tableName, params),
        queryFn: () => getOneRow(tableName, params),
        enabled: !!tableName && (options?.enabled ?? true),
    });

// GET PAGED
export const useGridbasePaged = <T = any>(
    tableName: string,
    params?: { page?: number; size?: number; filter?: string[]; sort?: string; select?: string }
) =>
    useQuery<T>({
        queryKey: gridbasePagedKey(tableName, params),
        queryFn: () => getPagedRows(tableName, params),
        enabled: !!tableName,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    });

// GET BY ID  (select destekli)
export const useGridbaseById = <T = any>(
    tableName: string,
    id: number,
    params?: { select?: string }
) =>
    useQuery<T>({
        queryKey: gridbaseRowKey(tableName, id, params),
        queryFn: () => getRowById(tableName, id, params),
        enabled: !!tableName && !!id,
    });

// CREATE
export const useCreateRow = (tableName: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => createRow(tableName, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "one"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "paged"] });
        },
    });
};

// UPDATE
export const useUpdateRow = (tableName: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: any }) =>
            updateRow(tableName, id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "one"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "paged"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, id] });
        },
    });
};

// PATCH
export const usePatchRow = (tableName: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: any }) =>
            patchRow(tableName, id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "one"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "paged"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, id] });
        },
    });
};

// DELETE
export const useDeleteRow = (tableName: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteRow(tableName, id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "one"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "paged"] });
        },
    });
};




// Tüm tablolar (filter / sort / select destekli)
export const useTablesAll = <T = any>(params?: {
    filter?: string[];
    sort?: string;
    select?: string;
}) =>
    useQuery<T[]>({
        queryKey: gridbaseTablesAllKey(params),
        queryFn: () => getAllTables(params),
    });

// Filtreye uyan ilk tablo
export const useTableOne = <T = any>(
    params?: { filter?: string[]; sort?: string; select?: string },
    options?: { enabled?: boolean }
) =>
    useQuery<T>({
        queryKey: gridbaseTableOneKey(params),
        queryFn: () => getOneTable(params),
        enabled: options?.enabled ?? true,
    });

// Id ile tek tablo
export const useTableById = <T = any>(id: number) =>
    useQuery<T>({
        queryKey: gridbaseTableByIdKey(id),
        queryFn: () => getGTableById(id),
        enabled: !!id,
    }); 

export const useCreateTable = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            name: string;
            modalSize?: string;
            viewType?: string;
            pageSize?: number;
            modalHeight?: number;
        }) => createTable(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", "one"] });
        },
    });
};

export const useUpdateTable = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: {
            id: number;
            payload: {
                name?: string;
                modalSize?: string;
                viewType?: string;
                pageSize?: number;
                modalHeight?: number;
            };
        }) => updateTable(id, payload),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", "one"] });
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", id] });
        },
    });
};

export const useDeleteTable = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, hard = false }: { id: number; hard?: boolean }) =>
            deleteTable(id, hard),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", "one"] });
        },
    });
};


export const useEmptyColumns = <T = any>(tableId: number) =>
    useQuery<T[]>({
        queryKey: gridbaseEmptyColumnsKey(tableId),
        queryFn: () => getEmptyColumns(tableId),
        enabled: !!tableId,
    });

// Boş kolonları sil (columnIds verilmezse tüm boşlar)
export const usePruneEmptyColumns = (tableId: number) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (columnIds?: number[]) => pruneEmptyColumns(tableId, columnIds),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", tableId, "empty-columns"] });
            qc.invalidateQueries({ queryKey: ["gridbase", "tables", tableId] });
        },
    });
};

export const useDeleteColumn = (tableName: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ columnName, hard = false }: { columnName: string; hard?: boolean }) =>
            deleteColumn(tableName, columnName, hard),
        onSuccess: () => {
            // Kolon silindi → bu tablonun tüm satır query'leri tazelensin
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "all"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "one"] });
            qc.invalidateQueries({ queryKey: ["gridbase", tableName, "paged"] });
        },
    });
};

export const useSetTableAccess = (tableName: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            readAccess?: string;
            writeAccess?: string;  
            readRequiredRole?: string;
            writeRequiredRole?: string;
            isOwnerScoped?: boolean;
            ownerColumn?: string;
        }) => setTableAccess(tableName, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["gridbase", "tables"] });
        },
    });
};









/* useGridbaseAll

//* 1. Hepsini çek (eskisi gibi, paramsız)
const { data } = useGridbaseAll<IOrder>(ORDER_TABLE);

//* 2. Tek filtre: sadece bu kullanıcının siparişleri
const { data } = useGridbaseAll<IOrder>(ORDER_TABLE, {
    filter: [`userId:eq:${usr.id}`],
});

//* 3. Filtre + sıralama: kullanıcının siparişleri, en yeni önce
const { data } = useGridbaseAll<IOrder>(ORDER_TABLE, {
    filter: [`userId:eq:${usr.id}`],
    sort: "orderDate:desc",
});

//* 4. Çoklu filtre: kullanıcının "pending" durumundaki siparişleri
const { data } = useGridbaseAll<IOrder>(ORDER_TABLE, {
    filter: [`userId:eq:${usr.id}`, "status:eq:pending"],
    sort: "orderDate:desc",
});

//* 5. Select (include): sadece bu alanlar dönsün (+ id her zaman)
const { data } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE, {
    select: "name,mainImage",
});

//* 6. Select (exclude): bu alanlar HARİÇ hepsi dönsün
const { data } = useGridbaseAll<IOrder>(ORDER_TABLE, {
    select: "-items,-shippingAddress",
});

*/


/* useGridbaseOne

//* 1. Order id'sinden faturayı bul (InvoiceDetails senaryosu)
const { data: invoice } = useGridbaseOne<IInvoice>(INVOICE_TABLE, {
  filter: [`wGOrderId:eq:${orderId}`],
});

//* 2. Birden fazla eşleşme varsa hangisinin geleceğini sort belirler
//*    (örn. en son oluşturulan favori)
const { data: fav } = useGridbaseOne<IFavorite>(FAVORITE_TABLE, {
  filter: [`wGProductId:eq:${productId}`],
  sort: "addedAt:desc",
});

//* 3. Koşullu çalıştırma: orderId hazır olmadan istek atma
const { data: invoice } = useGridbaseOne<IInvoice>(
  INVOICE_TABLE,
  { filter: [`wGOrderId:eq:${orderId}`] },
  { enabled: !!orderId }   // 3. parametre options
);

*/

/* useGridbaseById

//* 1. Normal (eskisi gibi)
const { data: order } = useGridbaseById<IOrder>(ORDER_TABLE, orderId);

//* 2. Select ile sadece istediğin alanlar
const { data: order } = useGridbaseById<IOrder>(ORDER_TABLE, orderId, {
    select: "orderNo,total,status",
});

//* 3. Ağır alanları hariç tut
const { data: order } = useGridbaseById<IOrder>(ORDER_TABLE, orderId, {
    select: "-items",
});

*/


/* useGridbasePaged

const { data } = useGridbasePaged<PagedResult>(ORDER_TABLE, {
    page: 1,
    size: 10,
});

const { data } = useGridbasePaged<PagedResult>(ORDER_TABLE, {
    page: 2,
    size: 20,
    filter: ["status:eq:delivered"],
    sort: "orderDate:desc",
});

const { data } = useGridbasePaged<PagedResult>(ECOMMERCE_TABLE, {
    page: 1,
    size: 12,
    select: "name,mainImage,status",
});

*/