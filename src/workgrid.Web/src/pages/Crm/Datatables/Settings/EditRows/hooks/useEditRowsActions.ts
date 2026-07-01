import { Datatable } from "common/data/Datatable";
import { TableCell } from "common/data/TableCell";
import { TableColumn } from "common/data/TableColumn";
import { TableRow } from "common/data/TableRow";
import { UpdateItem } from "pages/Crm/Datatables/components/Datatables";
import { useUpdateBulkTableCell } from "hooks/useTableCells";
import { useCreateBulkTableRow, useDeleteBulkTableRow } from "hooks/useTableRows";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UseEditRowsActionsProps {
    table: Datatable;
    rows: { [tableId: number]: (TableRow & { isAdded?: boolean })[] };
    setRows: React.Dispatch<
        React.SetStateAction<{ [tableId: number]: (TableRow & { isAdded?: boolean })[] }>
    >;
    columns: { [tableId: number]: TableColumn[] };
    fileColIds: number[];
    pendingUpdates: { [tableId: number]: { [cellId: number]: UpdateItem } };
    setPendingUpdates: React.Dispatch<
        React.SetStateAction<{ [tableId: number]: { [cellId: number]: UpdateItem } }>
    >;
    initialValues: { cells: Record<number, Record<number, any>> };
    fileDataRef: React.MutableRefObject<{
        loadings: { [key: string]: boolean[] };
        selectedFiles: { [key: string]: File[] };
        deletions: { [key: string]: string[] };
    }>;
    uploadAllFiles: (rowId: number) => Promise<{ [key: string]: string }>;
    deletePendingFiles: () => Promise<void>;
    buildFinalFileValue: (original: string, uploaded?: string, deleted?: string[]) => string;
    setTabState?: (tableId: number, state: boolean) => void;
    clearPendingUpdatesForTable: (tableId: number) => void;
    changeDeleting: (ids: number[], tableId: number) => void;
    setIsMultiDeleteButton: (val: boolean) => void;
    formikSubmitForm: () => void;
} 
export const useEditRowsActions = ({
    table,
    rows,
    setRows,
    columns,
    fileColIds,
    pendingUpdates,
    setPendingUpdates,
    initialValues,
    fileDataRef,
    uploadAllFiles,
    deletePendingFiles,
    buildFinalFileValue,
    setTabState,
    clearPendingUpdatesForTable,
    changeDeleting,
    setIsMultiDeleteButton, 
}: UseEditRowsActionsProps) => {
    const [deletedRowIds, setDeletedRowIds] = useState<{ [tableId: number]: number[] }>({});

    const { mutate: updateBulkTableCellMutation } = useUpdateBulkTableCell();
    const { mutate: deleteBulkTableRowMutation } = useDeleteBulkTableRow();
    const { mutate: createBulkTableRowMutation } = useCreateBulkTableRow();

    useEffect(() => {
        if (deletedRowIds[table?.id]?.length > 0) {
            changeDeleting(deletedRowIds[table?.id], table?.id);
        }
    }, [deletedRowIds[table?.id]]);

    const deleteCheckbox = useCallback(() => {
        const ele = document.querySelectorAll(".rowCheckBox:checked");
        setIsMultiDeleteButton(ele.length > 0);
    }, [setIsMultiDeleteButton]);

    const deleteRow = useCallback(
        async (rowId: number) => {
            const isAdded = (rows[table?.id] || []).some(x => x.isAdded && x.id === rowId);

            if (!isAdded) {
                setDeletedRowIds(prev => ({
                    ...prev,
                    [table?.id]: [...(prev[table?.id] || []), rowId],
                }));
            }

            setPendingUpdates(prev => {
                const currentTableUpdates = { ...prev[table?.id] };
                const rowToDelete = rows[table?.id]?.find(r => r.id === rowId);
                rowToDelete?.cellsFk?.forEach(cell => {
                    if (cell.id && currentTableUpdates[cell.id]) {
                        delete currentTableUpdates[cell.id];
                    }
                });
                return { ...prev, [table?.id]: currentTableUpdates };
            });

            setRows(prev => ({
                ...prev,
                [table?.id]: prev[table?.id]?.filter(r => r.id !== rowId) || [],
            }));
        },
        [table?.id, rows, setPendingUpdates, setRows]
    );

    const onSubmit = useCallback(async () => {
        console.log("onSubmit çalıştı")
        const currentFiles = fileDataRef.current.selectedFiles;
        const currentDeletions = fileDataRef.current.deletions;

        const hasPendingAdded = rows[table?.id]?.filter(x => x.isAdded).length > 0; 

 
        const hasPendingUpdates =
            pendingUpdates[table?.id] && Object.keys(pendingUpdates[table?.id]).length > 0;

        console.log("SUBMIT DEBUG 1", {
            hasPendingUpdates,
            pendingItems: Object.values(pendingUpdates[table?.id] || {}),
            pendingCount: Object.keys(pendingUpdates[table?.id] || {}).length,
        });
        
        const hasPendingDeletes =
                deletedRowIds[table?.id] && Object.keys(deletedRowIds[table?.id]).length > 0;
        const hasSelectedFiles = Object.values(currentFiles).some(f => f?.length > 0);
        const hasDeletions = Object.values(currentDeletions).some(l => l?.length > 0);

        if (
            !hasPendingAdded &&
            !hasPendingUpdates &&
            !hasSelectedFiles &&
            !hasDeletions &&
            !hasPendingDeletes
        ) {
            toast.info("Kaydedilecek değişiklik bulunamdı.");
            return;
        }

        const pendingItems = Object.values(pendingUpdates[table?.id] || {});

        const rowIdsFromUpdates = pendingItems.map(item => {
            const row = rows[table?.id].find(r => r.cellsFk.some(c => c.id === item.cellId));
            return row?.id;
        });
        const rowIdsFromFiles = Object.keys(currentFiles).map(key => Number(key.split(".")[1]));
        const rowIdsFromDeletions = Object.keys(currentDeletions)
            .map(key => {
                const parts = key.split(".");
                return parts.length > 1 ? Number(parts[1]) : null;
            })
            .filter((n): n is number => n !== null);

        const allChangedRowIds = Array.from(
            new Set([...rowIdsFromUpdates, ...rowIdsFromFiles, ...rowIdsFromDeletions])
        )
            .filter(Boolean)
            .filter(id => {
                const row = rows[table?.id].find(r => r.id === id);
                return !row?.isAdded;
            }) as number[];

        console.log("SUBMIT DEBUG 2", {
            allChangedRowIds,
            rowIdsFromUpdates,
        }); 
        

        try {
            const uploadedMaps: { [rowId: number]: any } = {};
            for (const rId of allChangedRowIds) {
                uploadedMaps[rId] = await uploadAllFiles(rId);
            }

            await deletePendingFiles();

            const updatePayload: {
                cellId: number;
                value: string;
                rowId: number;
                tableId: number;
            }[] = [];

            console.log("SUBMIT DEBUG 3", {
                updatePayloadLength: updatePayload.length,
                updatePayload,
            });
            allChangedRowIds.forEach(rowId => {
                const row = rows[table?.id].find(r => r.id === rowId);
                if (!row || row.isAdded) return;

                columns[table?.id]?.forEach(col => {
                    const cellInfo = row.cellsFk.find(c => c.columnId === col.id);
                    if (!cellInfo) return;

                    const mapKey = `cells.${rowId}.${col.id}`;
                    let finalValue: any = null;
                    let isChanged = false;

                    if (fileColIds.includes(col.id)) {
                        const originalValue = String(initialValues.cells?.[rowId]?.[col.id] || "");
                        const uploadedValue = uploadedMaps[rowId]?.[mapKey];

                        let deletedFiles = currentDeletions[mapKey] ?? [];
                        if (
                            deletedFiles &&
                            !Array.isArray(deletedFiles) &&
                            typeof deletedFiles === "object"
                        ) {
                            deletedFiles = (deletedFiles as any)[mapKey] || [];
                        }

                        if (
                            uploadedValue ||
                            (Array.isArray(deletedFiles) && deletedFiles.length > 0)
                        ) {
                            finalValue = buildFinalFileValue(
                                originalValue,
                                uploadedValue,
                                deletedFiles
                            );
                            isChanged = true;
                        }
                    } else {
                        const updateItem = pendingItems.find(item => item.cellId === cellInfo.id);
                        if (updateItem) {
                            finalValue =
                                typeof updateItem.value === "boolean"
                                    ? updateItem.value
                                        ? "1"
                                        : "0"
                                    : String(updateItem.value ?? "");
                            isChanged = true;
                        }
                    }

                    if (isChanged && finalValue !== null) {
                        updatePayload.push({
                            cellId: cellInfo.id ?? 0,
                            tableId: cellInfo.rowId ?? 0,
                            rowId: table?.id ?? 0,
                            value: String(finalValue),
                        });
                    }
                });
            });

            if ((deletedRowIds[table?.id] || []).length > 0) {
                await deleteBulkTableRowMutation(
                    { ids: deletedRowIds[table?.id] || [], tableId: table?.id },
                    {
                        onSuccess: () =>
                            toast.success("Satırlar silindi!", {
                                toastId: "deleteBulkTableRowMutation",
                            }),
                        onError: () =>
                            toast.error("Satırlar silinemedi!", {
                                toastId: "deleteBulkTableRowMutation",
                            }),
                    }
                );
                setDeletedRowIds(prev => ({ ...prev, [table?.id]: [] }));
            }

            // 5. Hücreleri güncelle
            if (updatePayload.length > 0) {
                await updateBulkTableCellMutation(updatePayload, {
                    onSuccess: () => {
                        fileDataRef.current = { loadings: {}, selectedFiles: {}, deletions: {} };
                        setTabState?.(table?.id, false);
                        setPendingUpdates(prev => ({ ...prev, [table?.id]: {} }));
                        clearPendingUpdatesForTable(table?.id);
                        toast.success("Tüm değişiklikler kaydedildi!");
                    },
                    onError: () => toast.error("Satırlar oluşturulamadı!"),
                });
            }

            // 6. Create new (isAdded) rows
            const addedRowsPromises = (rows[table?.id] || [])
                .filter(x => x.isAdded)
                .map(async item => {
                    const uploadedMap = await uploadAllFiles(item.id);
                    return {
                        cellsFk: item.cellsFk?.map(cell => {
                            const key = `cells.${item.id}.${cell.columnId}`;
                            return {
                                columnId: Number(cell.columnId),
                                value:
                                    fileColIds.includes(Number(cell.columnId)) && uploadedMap[key]
                                        ? uploadedMap[key]
                                        : typeof cell.value === "boolean"
                                        ? cell.value
                                            ? "1"
                                            : "0"
                                        : String(cell.value ?? ""),
                            } as TableCell;
                        }),
                    } as TableRow;
                });

            const finalAddedRows = await Promise.all(addedRowsPromises);

            if (finalAddedRows.length > 0) {
                await createBulkTableRowMutation(
                    { tableId: Number(table?.id), rows: finalAddedRows },
                    {
                        onSuccess: () => toast.success("Rows created successfully!"),
                        onError: () => toast.error("Rows could not be created!"),
                    }
                );
            }
        } catch (error) {
            console.error("Save Error:", error);
            toast.error("Error updating cells.");
        }
    }, [
        table,
        rows,
        columns,
        fileColIds,
        pendingUpdates,
        deletedRowIds,
        initialValues,
        fileDataRef,
        uploadAllFiles,
        deletePendingFiles,
        buildFinalFileValue,
        setPendingUpdates,
        setTabState,
        clearPendingUpdatesForTable,
    ]);


    const bulkDeleteCheckedRows = useCallback(async () => {
        // 1. Seçili checkbox'lardan id'leri topla
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".rowCheckBox:checked");
        const ids = Array.from(checkboxes).map(cb => Number(cb.value)).filter(Boolean);
 
        if (ids.length === 0) {
            toast.warning("Lütfen silmek için en az bir satır seçin!");
            return;
        }
 
        // 2. isAdded (henüz kaydedilmemiş) olanları ayır — onlar API'ye gitmez,
        //    sadece local'den çıkar. Kaydedilmiş olanlar API'ye gider.
        const currentRows = rows[table?.id] || [];
        const addedIds = ids.filter(id => currentRows.some(r => r.isAdded && r.id === id));
        const persistedIds = ids.filter(id => !addedIds.includes(id));
 
        // 3. Kaydedilmiş satırları API'den sil
        if (persistedIds.length > 0) {
            await deleteBulkTableRowMutation(
                { ids: persistedIds, tableId: table?.id },
                {
                    onSuccess: () =>
                        toast.success("Seçili satırlar silindi!", { toastId: "bulkDeleteRows" }),
                    onError: () =>
                        toast.error("Satırlar silinemedi!", { toastId: "bulkDeleteRows" }),
                }
            );
        }
 
        // 4. Local rows'tan TÜM seçilenleri çıkar (liste anında güncellensin)
        setRows(prev => ({
            ...prev,
            [table?.id]: (prev[table?.id] || []).filter(r => !ids.includes(r.id)),
        }));
 
        // 5. Bu satırlara ait pending update'leri temizle
        setPendingUpdates(prev => {
            const currentTableUpdates = { ...prev[table?.id] };
            ids.forEach(id => {
                const row = currentRows.find(r => r.id === id);
                row?.cellsFk?.forEach(cell => {
                    if (cell.id && currentTableUpdates[cell.id]) {
                        delete currentTableUpdates[cell.id];
                    }
                });
            });
            return { ...prev, [table?.id]: currentTableUpdates };
        });
 
        // 6. Checkbox'ları temizle + toplu sil butonunu kapat
        document.querySelectorAll<HTMLInputElement>(".rowCheckBox:checked")
            .forEach(cb => (cb.checked = false));
        const checkAll = document.getElementById("checkBoxAll") as HTMLInputElement | null;
        if (checkAll) checkAll.checked = false;
        setIsMultiDeleteButton(false);
    }, [table?.id, rows, setRows, setPendingUpdates, deleteBulkTableRowMutation, setIsMultiDeleteButton]);

    return {
        deletedRowIds,
        bulkDeleteCheckedRows,
        setDeletedRowIds,
        deleteRow,
        deleteCheckbox,
        onSubmit,
        createBulkTableRowMutation,
        deleteBulkTableRowMutation,
        updateBulkTableCellMutation,
    };
};