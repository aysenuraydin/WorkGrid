import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getAbout, updateAbout } from 'helpers/backend_helper';

export const ABOUT_QUERY_KEYS = {
    all: ['about'] as const,
};

export const useGetAbout = () =>
    useQuery({
        queryKey: ABOUT_QUERY_KEYS.all,
        queryFn: getAbout,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });

export const useUpdateAbout = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateAbout,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ABOUT_QUERY_KEYS.all });
            toast.success("Hakkımızda bilgisi başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Hakkımızda güncellenirken bir hata oluştu.");
        },
    });
};