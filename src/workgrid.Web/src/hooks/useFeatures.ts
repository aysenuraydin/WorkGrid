import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
    getLandingFeatures, 
    createLandingFeature, 
    updateLandingFeature, 
    deleteLandingFeature, 
    getLandingCta, 
    updateLandingCta 
} from 'helpers/backend_helper';
import { IFeatureItem, ICtaConfig } from 'common/data/tenant'; 

export const LANDING_QUERY_KEYS = {
    features: ['landing-features'] as const,
    cta: ['landing-cta'] as const,
};

// --- LANDING FEATURES ---
export const useGetLandingFeatures = () => useQuery({
    queryKey: LANDING_QUERY_KEYS.features,
    queryFn: getLandingFeatures,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData, 
});

export const useCreateLandingFeature = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createLandingFeature,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: LANDING_QUERY_KEYS.features });
            toast.success("Özellik başarıyla eklendi.");
        },
        onError: () => toast.error("Özellik eklenemedi.")
    });
};

export const useUpdateLandingFeature = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: IFeatureItem }) => 
            updateLandingFeature(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: LANDING_QUERY_KEYS.features });
            toast.success("Özellik güncellendi.");
        },
        onError: () => toast.error("Özellik güncellenirken hata oluştu.")
    });
};

export const useDeleteLandingFeature = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteLandingFeature,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: LANDING_QUERY_KEYS.features });
            toast.success("Özellik silindi.");
        },
        onError: () => toast.error("Özellik silinemedi.")
    });
};

// --- LANDING CTA ---
export const useGetLandingCta = () => useQuery({
    queryKey: LANDING_QUERY_KEYS.cta,
    queryFn: getLandingCta
});

export const useUpdateLandingCta = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateLandingCta,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: LANDING_QUERY_KEYS.cta });
            toast.success("CTA ayarları güncellendi.");
        },
        onError: () => toast.error("CTA güncellenirken hata oluştu.")
    });
};