import React, { createContext, useContext, ReactNode } from "react";
import { useGetFaq, useUpdateFaq } from "hooks/useFaq";
import { IFAQCategory } from "common/data/tenant";

interface FaqContextValue {
    faqs: IFAQCategory[];
    isLoading: boolean;
    isError: boolean;
    saveFaqs: (data: IFAQCategory[]) => void;
    isSaving: boolean;
}

const FaqContext = createContext<FaqContextValue | undefined>(undefined);

export const FaqProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetFaq();
    const { mutate: saveFaqs, isPending: isSaving } = useUpdateFaq();

    const value: FaqContextValue = {
        faqs: data ?? [],
        isLoading,
        isError,
        saveFaqs,
        isSaving,
    };

    return (
        <FaqContext.Provider value={value}>
            {children}
        </FaqContext.Provider>
    );
};

export const useFaqContext = () => {
    const ctx = useContext(FaqContext);
    if (!ctx) throw new Error("useFaqContext must be used within FaqProvider");
    return ctx;
};
