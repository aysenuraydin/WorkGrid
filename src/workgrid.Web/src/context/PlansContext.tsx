import React, { createContext, useContext, ReactNode } from "react";
import { useGetPlans, useUpdatePlans } from "hooks/usePlans";
import { IPlanSection } from "common/data/tenant";

interface PlansContextValue {
    plans: IPlanSection | undefined;
    isLoading: boolean;
    isError: boolean;
    savePlans: (data: IPlanSection) => void;
    isSaving: boolean;
}

const PlansContext = createContext<PlansContextValue | undefined>(undefined);

export const PlansProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetPlans();
    const { mutate: savePlans, isPending: isSaving } = useUpdatePlans();

    const value: PlansContextValue = {
        plans: data,
        isLoading,
        isError,
        savePlans,
        isSaving,
    };

    return (
        <PlansContext.Provider value={value}>
            {children}
        </PlansContext.Provider>
    );
};

export const usePlansContext = () => {
    const ctx = useContext(PlansContext);
    if (!ctx) throw new Error("usePlansContext must be used within PlansProvider");
    return ctx;
};
