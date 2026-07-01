import React, { createContext, useContext, ReactNode } from "react";
import { IContactConfig } from "common/data/tenant";
import { useGetContact, useUpdateContact } from "hooks/useContact";

interface ContactContextValue {
    contact: IContactConfig | undefined;
    isLoading: boolean;
    isError: boolean;
    saveContact: (data: IContactConfig) => void;
    isSaving: boolean;
}

const ContactContext = createContext<ContactContextValue | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetContact();
    const { mutate: saveContact, isPending: isSaving } = useUpdateContact();

    const value: ContactContextValue = {
        contact: data,
        isLoading,
        isError,
        saveContact,
        isSaving,
    };

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContactContext = () => {
    const ctx = useContext(ContactContext);
    if (!ctx) throw new Error("useContactContext must be used within ContactProvider");
    return ctx;
};