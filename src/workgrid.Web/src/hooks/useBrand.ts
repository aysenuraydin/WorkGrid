import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IBrandConfig } from 'common/data/tenant';
import {  
    getBrand, 
    updateBrand, 
} from 'helpers/backend_helper';

export const BRAND_QUERY_KEYS = {
    all: ['brand'] as const,
};

export const useGetBrand = () => useQuery<IBrandConfig>({ 
    queryKey: BRAND_QUERY_KEYS.all, 
    queryFn: getBrand,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData, 
});

export const useUpdateBrand = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateBrand, 
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: BRAND_QUERY_KEYS.all });
            toast.success("Marka bilgileri başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Marka bilgileri güncellenirken bir hata oluştu.");
        }
    });
};