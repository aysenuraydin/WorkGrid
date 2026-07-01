import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
    saveMenuSnapshot,
    getMenuSnapshot,
    restoreMenuSnapshot,
} from 'helpers/backend_helper';

export interface IMenuSnapshotResult {
    exists: boolean;
    items: any[];
    savedAt?: string | null;
}


export const MENU_SNAPSHOT_QUERY_KEYS = {
    all: ['menu-snapshot'] as const,
};

// --- GET 
export const useGetMenuSnapshot = () => useQuery<IMenuSnapshotResult>({
    queryKey: MENU_SNAPSHOT_QUERY_KEYS.all,
    queryFn: getMenuSnapshot,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
});

// --- post
export const useSaveMenuSnapshot = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: saveMenuSnapshot,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: MENU_SNAPSHOT_QUERY_KEYS.all });
            toast.success("Menu ayarlari basariyla kaydedildi.");
        },
        onError: () => {
            toast.error("Menu ayarlari kaydedilirken bir hata olustu.");
        },
    });
};

// --- put
export const useRestoreMenuSnapshot = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: restoreMenuSnapshot,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: MENU_SNAPSHOT_QUERY_KEYS.all });
            qc.invalidateQueries({ queryKey: ["GetDeletedMenuItems"] });
            qc.invalidateQueries({ queryKey: ["GetMenuItems"] });
            toast.success("Menu yedekten geri yuklendi.");
        },
        onError: () => {
            toast.error("Geri yukleme sirasinda bir hata olustu.");
        },
    });
};