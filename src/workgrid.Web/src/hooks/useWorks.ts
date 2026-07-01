import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {  
    getWorks, createWork, updateWork, deleteWork, 
} from 'helpers/backend_helper';
import { toast } from 'react-toastify';

// --- WORKS (PROJECTS) ---
export const useGetWorks = () => useQuery({ 
    queryKey: ['works'], 
    queryFn: getWorks,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});



export const useCreateWork = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createWork,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['works'] });
            toast.success("Değişiklikler kaydedildi.");  
        },
        onError: () => { 
            toast.error("Kaydedilemedi, tekrar deneyin.");
        }
    });
};

export const useUpdateWork = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateWork(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['works'] });
            toast.success("Değişiklikler kaydedildi.");  
        },
        onError: () => { 
            toast.error("Kaydedilemedi, tekrar deneyin.");
        }
    });
};

export const useDeleteWork = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteWork(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['works'] });
            toast.success("Değişiklikler kaydedildi.");  
        },
        onError: () => { 
            toast.error("Kaydedilemedi, tekrar deneyin.");
        }
    });
};
