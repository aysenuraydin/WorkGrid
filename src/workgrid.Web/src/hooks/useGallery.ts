import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getGallery, createGallery, updateGallery, deleteGallery } from 'helpers/backend_helper';

export const GALLERY_QUERY_KEYS = {
    all: ['gallery'] as const,
};

export const useGetGallery = () =>
    useQuery({
        queryKey: GALLERY_QUERY_KEYS.all,
        queryFn: getGallery,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });

export const useCreateGallery = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createGallery,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
            toast.success("Galeri öğesi eklendi.");
        },
        onError: () => {
            toast.error("Galeri öğesi eklenirken bir hata oluştu.");
        },
    });
};

export const useUpdateGallery = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateGallery,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
            toast.success("Galeri öğesi güncellendi.");
        },
        onError: () => {
            toast.error("Galeri öğesi güncellenirken bir hata oluştu.");
        },
    });
};

export const useDeleteGallery = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteGallery,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
            toast.success("Galeri öğesi silindi.");
        },
        onError: () => {
            toast.error("Galeri öğesi silinirken bir hata oluştu.");
        },
    });
};