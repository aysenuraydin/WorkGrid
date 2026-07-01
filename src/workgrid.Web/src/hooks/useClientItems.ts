import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {  
    getClientItems, 
    createClientItem, 
    updateClientItem, 
    deleteClientItem 
} from 'helpers/backend_helper';  

// Merkezi Query Key tanımlaması
export const CLIENT_ITEMS_QUERY_KEYS = {
    all: ['client-items'] as const,
};

// 1. Veri Okuma
export const useGetClientItems = () => useQuery({ 
    queryKey: CLIENT_ITEMS_QUERY_KEYS.all, 
    queryFn: getClientItems,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData, 
});

// 2. Yeni Kayıt
export const useCreateClientItem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createClientItem, 
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLIENT_ITEMS_QUERY_KEYS.all });
            toast.success("Müşteri öğesi başarıyla eklendi.");
        },
        onError: () => toast.error("Öğe eklenirken hata oluştu.")
    });
};

// 3. Güncelleme
export const useUpdateClientItem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: any }) => updateClientItem(id, data), 
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLIENT_ITEMS_QUERY_KEYS.all });
            toast.success("Müşteri öğesi güncellendi.");
        },
        onError: () => toast.error("Öğe güncellenirken hata oluştu.")
    });
};

// 4. Silme
export const useDeleteClientItem = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteClientItem(id), 
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CLIENT_ITEMS_QUERY_KEYS.all });
            toast.success("Müşteri öğesi silindi.");
        },
        onError: () => toast.error("Öğe silinemedi.")
    });
};