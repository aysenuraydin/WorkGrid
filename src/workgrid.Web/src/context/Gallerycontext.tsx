import React, { createContext, useContext, ReactNode } from "react";
import { useGetGallery, useCreateGallery, useUpdateGallery, useDeleteGallery } from "hooks/useGallery";
import { IGalleryItem } from "common/data/tenant";

interface GalleryContextValue {
    items: IGalleryItem[];
    isLoading: boolean;
    isError: boolean;

    addItem: (
        data: Omit<IGalleryItem, "id">,
        options?: {
            onSuccess?: () => void;
            onError?: () => void;
        }
    ) => void;

    updateItem: (
        data: IGalleryItem,
        options?: {
            onSuccess?: () => void;
            onError?: () => void;
        }
    ) => void;
    deleteItem: (
        id: number,
        options?: {
            onSuccess?: () => void;
            onError?: () => void;
            onSettled?: () => void;
        }
    ) => void;


    isAdding: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

const GalleryContext = createContext<GalleryContextValue | undefined>(undefined);

export const GalleryProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetGallery();
    const { mutate: addItem,    isPending: isAdding   } = useCreateGallery();
    const { mutate: updateItem, isPending: isUpdating } = useUpdateGallery();
    const { mutate: deleteItem, isPending: isDeleting } = useDeleteGallery();

    const value: GalleryContextValue = {
        items: data ?? [],
        isLoading,
        isError,
        addItem,
        updateItem,
        deleteItem,
        isAdding,
        isUpdating,
        isDeleting,
    };

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
};

export const useGalleryContext = () => {
    const ctx = useContext(GalleryContext);
    if (!ctx) throw new Error("useGalleryContext must be used within GalleryProvider");
    return ctx;
};