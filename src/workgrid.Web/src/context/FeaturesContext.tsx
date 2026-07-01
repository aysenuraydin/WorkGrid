import React, { createContext, useContext, ReactNode } from "react";
import { 
    useGetLandingFeatures, 
    useCreateLandingFeature, 
    useUpdateLandingFeature, 
    useDeleteLandingFeature, 
    useGetLandingCta, 
    useUpdateLandingCta 
} from "hooks/useFeatures"; 
import { IFeatureItem, ICtaConfig } from "common/data/tenant";

interface FeaturesContextValue {
    features: IFeatureItem[];
    ctaConfig: ICtaConfig | undefined;
    
    isLoading: boolean;
    isError: boolean;
    isMutating: boolean; 
    
    createFeature: (data: IFeatureItem) => void;
    updateFeature: (payload: { id: number | string; data: IFeatureItem }) => void;
    deleteFeature: (id: number | string) => void;
    
    updateCta: (data: ICtaConfig) => void;
}

const FeaturesContext = createContext<FeaturesContextValue | undefined>(undefined);

export const FeaturesProvider = ({ children }: { children: ReactNode }) => {
    const { data: featuresResponse, isLoading: fLoading, isError: fError } = useGetLandingFeatures();
    const { data: ctaResponse, isLoading: cLoading, isError: cError } = useGetLandingCta();

    const createMutation = useCreateLandingFeature();
    const updateMutation = useUpdateLandingFeature();
    const deleteMutation = useDeleteLandingFeature();
    const ctaMutation = useUpdateLandingCta();

    const features: IFeatureItem[] = (featuresResponse as any)?.data ?? featuresResponse ?? [];
    const ctaConfig: ICtaConfig | undefined = (ctaResponse as any)?.data ?? ctaResponse;

    const isLoading = fLoading || cLoading;
    const isError = fError || cError;
    
    const isMutating = 
        createMutation.isPending || 
        updateMutation.isPending || 
        deleteMutation.isPending || 
        ctaMutation.isPending;

    return (
        <FeaturesContext.Provider value={{
            features,
            ctaConfig,
            isLoading,
            isError,
            isMutating,
            
            createFeature: createMutation.mutate,
            updateFeature: updateMutation.mutate,
            deleteFeature: deleteMutation.mutate,
            updateCta: ctaMutation.mutate
        }}>
            {children}
        </FeaturesContext.Provider>
    );
};

export const useFeaturesContext = () => {
    const context = useContext(FeaturesContext);
    if (!context) {
        throw new Error("useFeaturesContext mutlaka bir FeaturesProvider sarmalı içinde kullanılmalıdır!");
    }
    return context;
};