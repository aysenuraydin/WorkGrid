import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getFaq, 
    updateFaq, 
} from 'helpers/backend_helper';

export const FAQ_QUERY_KEYS = {
    all: ['faq'] as const,
};

// --- FAQ ---
export const useGetFaq = () => useQuery({ 
    queryKey: FAQ_QUERY_KEYS.all, 
    queryFn: getFaq,        
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});

export const useUpdateFaq = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateFaq,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: FAQ_QUERY_KEYS.all });
            toast.success("SSS (FAQ) başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("SSS güncellenirken bir hata oluştu.");
        }
    });
};