import React, { createContext, useContext, ReactNode } from "react";
import { useGetBrand, useUpdateBrand } from "hooks/useBrand";
import { IBrandConfig } from "common/data/tenant";

interface BrandContextValue {
    brand: IBrandConfig | undefined;
    isLoading: boolean;
    isError: boolean;
    saveBrand: (data: IBrandConfig) => void;
    isSaving: boolean;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetBrand();
    const { mutate: saveBrand, isPending: isSaving } = useUpdateBrand();

    const value: BrandContextValue = {
        brand: data,
        isLoading,
        isError,
        saveBrand,
        isSaving,
    };

    return (
        <BrandContext.Provider value={value}>
            {children}
        </BrandContext.Provider>
    );
};

export const useBrandContext = () => {
    const ctx = useContext(BrandContext);
    if (!ctx) throw new Error("useBrandContext must be used within BrandProvider");
    return ctx;
};

