import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ISocialLink } from 'common/data/tenant';
import { 
    getSocialLinks, 
    updateSocialLink, 
    deleteSocialLink, 
    createSocialLink,
} from 'helpers/backend_helper';

export const SOCIAL_LINKS_QUERY_KEYS = {
    all: ['socialLinks'] as const,
};

export const useGetSocialLinks = () => useQuery<ISocialLink[]>({ 
    queryKey: SOCIAL_LINKS_QUERY_KEYS.all, 
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});

export const useCreateSocialLink = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => createSocialLink(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: SOCIAL_LINKS_QUERY_KEYS.all });
            toast.success("Sosyal medya bağlantısı başarıyla eklendi.");
        },
        onError: () => {
            toast.error("Bağlantı eklenirken bir hata oluştu.");
        }
    });
};

export const useUpdateSocialLink = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: any, data: any }) => updateSocialLink(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: SOCIAL_LINKS_QUERY_KEYS.all });
            toast.success("Bağlantı başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Bağlantı güncellenirken bir hata oluştu.");
        }
    });
};

export const useDeleteSocialLink = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string | number) => deleteSocialLink(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: SOCIAL_LINKS_QUERY_KEYS.all });
            toast.success("Bağlantı silindi.");
        },
        onError: () => {
            toast.error("Bağlantı silinemedi.");
        }
    });
};