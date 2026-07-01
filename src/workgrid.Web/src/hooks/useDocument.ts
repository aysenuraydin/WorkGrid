import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getDocument, updateDocument } from 'helpers/backend_helper';

export const DOCUMENT_QUERY_KEYS = {
    all: ['document'] as const,
};

export const useGetDocument = () =>
    useQuery({
        queryKey: DOCUMENT_QUERY_KEYS.all,
        queryFn: getDocument,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    });

export const useUpdateDocument = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateDocument,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: DOCUMENT_QUERY_KEYS.all });
            toast.success("Hakkımızda bilgisi başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Hakkımızda güncellenirken bir hata oluştu.");
        },
    });
};