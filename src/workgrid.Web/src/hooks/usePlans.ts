import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {  
    getPlans, 
    updatePlans, 
} from 'helpers/backend_helper';

export const PLANS_QUERY_KEYS = {
    all: ['plans'] as const,
};

// --- PLANS ---
export const useGetPlans = () => useQuery({ 
    queryKey: PLANS_QUERY_KEYS.all, 
    queryFn: getPlans,  
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData, 
});

export const useUpdatePlans = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updatePlans,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: PLANS_QUERY_KEYS.all });
            toast.success("Planlar başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Planlar güncellenirken bir hata oluştu.");
        }
    });
};