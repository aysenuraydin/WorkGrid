import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {  
    getServices, updateServices, 
} from 'helpers/backend_helper';
import { toast } from 'react-toastify';

// --- SERVICES ---
export const useGetServices = () => useQuery({ 
    queryKey: ['services'], 
    queryFn: getServices,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});

export const useUpdateServices = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateServices,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['services'] })
            toast.success("Değişiklikler kaydedildi.");  
        },
        onError: () => { 
            toast.error("Kaydedilemedi, tekrar deneyin.");
        }
    });
}; 