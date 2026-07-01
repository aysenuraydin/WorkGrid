import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getContact, 
    updateContact, 
} from 'helpers/backend_helper';

export const CONTACT_QUERY_KEYS = {
    all: ['contact'] as const,
};

// --- CONTACT ---
export const useGetContact = () => useQuery({ 
    queryKey: CONTACT_QUERY_KEYS.all, 
    queryFn: getContact,        
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 1000 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});

export const useUpdateContact = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateContact,  
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: CONTACT_QUERY_KEYS.all });
            toast.success("İletişim bilgileri güncellendi.");
        },
        onError: () => {
            toast.error("İletişim bilgileri güncellenirken bir hata oluştu.");
        }
    });
};