import React, { createContext, useContext, ReactNode } from "react";
import {
    useGetSocialLinks,
    useUpdateSocialLink,
    useDeleteSocialLink,
} from "hooks/useSocialLinks"; 
import { ISocialLink } from "common/data/tenant";

interface SocialLinksContextValue {
    links: ISocialLink[];
    isLoading: boolean;
    isError: boolean;
    updateLink: (id: string | number, data: Partial<ISocialLink>) => void;
    deleteLink: (id: string | number) => void;
    isUpdating: boolean;
    isDeleting: boolean;
}

const SocialLinksContext = createContext<SocialLinksContextValue | undefined>(undefined);

export const SocialLinksProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetSocialLinks();
    const { mutate: updateLink, isPending: isUpdating } = useUpdateSocialLink();
    const { mutate: deleteLink, isPending: isDeleting } = useDeleteSocialLink();

    const value: SocialLinksContextValue = {
        links: data ?? [],
        isLoading,
        isError,
        updateLink: (id, data) => updateLink({ id, data }),
        deleteLink,
        isUpdating,
        isDeleting,
    };

    return (
        <SocialLinksContext.Provider value={value}>
            {children}
        </SocialLinksContext.Provider>
    );
};

export const useSocialLinksContext = () => {
    const ctx = useContext(SocialLinksContext);
    if (!ctx) throw new Error("useSocialLinksContext must be used within SocialLinksProvider");
    return ctx;
};
