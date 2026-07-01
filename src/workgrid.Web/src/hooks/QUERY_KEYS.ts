export const QUERY_KEYS = {
    TABLE_ROWS: (tableId: number) => ['tableRows', tableId] as const,
    DELETED_ROWS: (tableId: number) => ['GetDeletedTableRows', tableId] as const,
    // ...
};
