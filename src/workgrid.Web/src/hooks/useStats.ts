import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {  
    getStats, updateStats,  
} from 'helpers/backend_helper';
import { toast } from 'react-toastify';


// --- STATS ---
export const useGetStats = () => useQuery({ 
    queryKey: ['stats'], 
    queryFn: getStats,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
}); 
export const useUpdateStats = () => {
    const qc = useQueryClient();
    
    return useMutation({
        mutationFn: updateStats,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["stats"] });
            toast.success("İstatistikler başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("İstatistikler güncellenirken bir sorun oluştu.");
        }
    });
};