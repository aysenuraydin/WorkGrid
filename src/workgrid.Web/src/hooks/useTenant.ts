import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { TenantConfig } from 'common/data/TenantTypes';
import { 
    resetConfig,
    clearCache,
    updateConfig,
    getConfig
} from 'helpers/backend_helper';

export const TENANT_QUERY_KEYS = {
    config: ["tenant", "config"] as const,
} as const;

// --- Tenant CONFIG ---
export const useGetTenantConfig = () => useQuery<TenantConfig>({ 
    queryKey: TENANT_QUERY_KEYS.config, 
    queryFn: getConfig,
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData,  
});

export const useUpdateTenantConfig = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => updateConfig(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.config });
            toast.success("Tenant ayarları güncellendi.");
        },
        onError: () => {
            toast.error("Ayarlar güncellenirken bir hata oluştu.");
        }
    });
};

export const useResetTenantConfig = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => resetConfig(),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.config });
            toast.info("Tenant ayarları sıfırlandı.");
        },
        onError: () => {
            toast.error("Sıfırlama işlemi başarısız.");
        }
    });
};

export const useClearTenantCache = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => clearCache(),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: TENANT_QUERY_KEYS.config });
            toast.success("Önbellek başarıyla temizlendi.");
        },
        onError: () => {
            toast.error("Önbellek temizlenemedi.");
        }
    });
};