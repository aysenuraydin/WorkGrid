import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getLandingHero, updateLandingHero, deleteLandingHero } from 'helpers/backend_helper';
import { IUpdateLandingHeroDto } from 'common/data/tenant';

export const LANDING_HERO_QUERY_KEYS = {
    all: ['landinghero2'] as const,
};

// get
export const useGetLandingHero = () => {
    return useQuery({
        queryKey: LANDING_HERO_QUERY_KEYS.all,
        queryFn: getLandingHero,
        staleTime: 1000 * 60 * 5,  
        gcTime: 1000 * 60 * 10,  
        refetchOnWindowFocus: false,  
        placeholderData: (previousData) => previousData, 
    });
};

// put
export const useUpdateLandingHero = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: IUpdateLandingHeroDto) => updateLandingHero(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: LANDING_HERO_QUERY_KEYS.all });
            toast.success("Hero alanı başarıyla güncellendi.");
        },
        onError: () => {
            toast.error("Hero alanı güncellenirken bir hata oluştu.");
        }
    });
};

// delete
export const useDeleteLandingHero = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => deleteLandingHero(),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: LANDING_HERO_QUERY_KEYS.all });
            toast.info("Hero alanı sıfırlandı.");
        },
        onError: () => {
            toast.error("Sıfırlama işlemi başarısız.");
        }
    });
};