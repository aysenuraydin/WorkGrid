import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getTestimonials, 
    createTestimonial, 
    updateTestimonial, 
    deleteTestimonial, 
} from 'helpers/backend_helper';

// --- TESTIMONIALS ---
export const useGetTestimonials = () => useQuery({ 
    queryKey: ['testimonials'], 
    queryFn: getTestimonials,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});

export const useCreateTestimonial = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createTestimonial, 
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success("Referans başarıyla oluşturuldu.");
        },
        onError: () => {
            toast.error("Referans oluşturulurken bir hata oluştu.");
        }
    });
};

export const useUpdateTestimonial = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => updateTestimonial(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success("Değişiklikler başarıyla kaydedildi.");
        },
        onError: () => {
            toast.error("Değişiklikler kaydedilemedi.");
        }
    });
};

export const useDeleteTestimonial = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteTestimonial(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success("Referans silindi.");
        },
        onError: () => {
            toast.error("Referans silinemedi.");
        }
    });
};