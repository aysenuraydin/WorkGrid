import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getCommerce, updateCommerce } from 'helpers/backend_helper';
import { ICommerceConfig } from 'common/data/ICommerceConfig';

export const COMMERCE_QUERY_KEYS = {
    all: ['commerce'] as const,
};

// GET  
export const useGetCommerce = () => useQuery<ICommerceConfig>({ 
    queryKey: COMMERCE_QUERY_KEYS.all, 
    queryFn: getCommerce,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData, 
});

// UPDATE  
export const useUpdateCommerce = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateCommerce, 
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: COMMERCE_QUERY_KEYS.all });
            toast.success("Ticari bilgiler başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Ticari bilgiler güncellenirken bir hata oluştu.");
        }
    });
};