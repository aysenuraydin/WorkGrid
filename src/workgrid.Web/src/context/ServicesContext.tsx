import React, { createContext, useContext, ReactNode } from "react";
import { useGetServices, useUpdateServices } from "hooks/useServices";
import { IServiceSection } from "common/data/tenant";

interface ServicesContextValue {
    services: IServiceSection | undefined;
    isLoading: boolean;
    isError: boolean;
    saveServices: (data: IServiceSection) => void;
    isSaving: boolean;
}

const ServicesContext = createContext<ServicesContextValue | undefined>(undefined);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetServices();
    const { mutate: saveServices, isPending: isSaving } = useUpdateServices();

    const value: ServicesContextValue = {
        services: data,
        isLoading,
        isError,
        saveServices,
        isSaving,
    };

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    );
};

export const useServicesContext = () => {
    const ctx = useContext(ServicesContext);
    if (!ctx) throw new Error("useServicesContext must be used within ServicesProvider");
    return ctx;
};
