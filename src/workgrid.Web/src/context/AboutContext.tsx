import React, { createContext, useContext, ReactNode } from "react";
import { useGetAbout, useUpdateAbout } from "hooks/useAbout";
import { IAboutConfig } from "common/data/tenant";

interface AboutContextValue {
    about: IAboutConfig;
    isLoading: boolean;
    isError: boolean;
    saveAbout: (
        data: IAboutConfig,
        options?: {
            onSuccess?: () => void;
            onError?: () => void;
        }
    ) => void;
    isSaving: boolean;
}

const AboutContext = createContext<AboutContextValue | undefined>(undefined);

export const AboutProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetAbout();
    const { mutate: saveAbout, isPending: isSaving } = useUpdateAbout();

    const value: AboutContextValue = {
        about: data ?? { url: "", description: "" },
        isLoading,
        isError,
        saveAbout,
        isSaving,
    };

    return (
        <AboutContext.Provider value={value}>
            {children}
        </AboutContext.Provider>
    );
};

export const useAboutContext = () => {
    const ctx = useContext(AboutContext);
    if (!ctx) throw new Error("useAboutContext must be used within AboutProvider");
    return ctx;
};