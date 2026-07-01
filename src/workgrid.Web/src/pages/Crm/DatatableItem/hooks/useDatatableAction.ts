import { useDeleteTableRow, useHardDeleteTableRow, useRestoreDeletedTableRow } from "hooks/useTableRows";
import { toast } from "react-toastify";

export const useDatatableAction = (tableId: number) => {
    const { mutate: deleteTableRowMutation } = useDeleteTableRow(); 
    const { mutate: hardDeleteTableRowMutation } = useHardDeleteTableRow(); 
    const { mutate: restoreDeletedTableRowMutation } = useRestoreDeletedTableRow();  
    
    // Kalıcı Silme
    const hardDeleteTableRow = async (rowId: number) => {
        await hardDeleteTableRowMutation({ id: rowId, tableId: tableId ?? 0 }, {
            onSuccess: () => {
                toast.success("Satır kalıcı olarak silindi!");
            },
            onError: () => toast.error("Satır kalıcı olarak silinemedi!")
        });  
    };

    // Geçici Silme
    const deleteItem = async (rowId: number) => { 
        await deleteTableRowMutation({ id: rowId, tableId: tableId ?? 0 }, {
            onSuccess: () => {
                toast.success("Satır başarıyla silindi!");
            },
            onError: () => toast.error("Satır silinemedi!")
        });  
    };

    // Geri Yükleme
    const backToDelete = async (rowId: number) => {
        await restoreDeletedTableRowMutation({ id: rowId, tableId: tableId }, {
            onSuccess: () => {
                toast.success("Satır başarıyla geri yüklendi!");
            },
            onError: () => toast.error("Satır geri yüklenemedi!")
        }); 
    };

    return {
        hardDeleteTableRow, 
        deleteItem, 
        backToDelete
    };
};