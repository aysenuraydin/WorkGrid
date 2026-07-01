import React, { createContext, useContext, ReactNode } from "react";
import { 
    useGetClientItems, 
    useCreateClientItem, 
    useUpdateClientItem, 
    useDeleteClientItem 
} from "hooks/useClientItems"; 

export interface IClientItem {
    id?: number | string;
    name: string;
    logoUrl: string;
}

interface ClientItemsContextValue {
    clients: IClientItem[];
    isLoading: boolean;
    isError: boolean;
    createClient: (data: IClientItem) => void;
    updateClient: (id: number | string, data: any) => void;
    deleteClient: (id: number | string) => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

const ClientItemsContext = createContext<ClientItemsContextValue | undefined>(undefined);

export const ClientItemsProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetClientItems();
    const { mutate: create, isPending: isCreating } = useCreateClientItem();
    const { mutate: update, isPending: isUpdating } = useUpdateClientItem();
    const { mutate: remove, isPending: isDeleting } = useDeleteClientItem();

    const value: ClientItemsContextValue = {
        clients: data ?? [],  
        isLoading,
        isError,
        createClient: create,
        updateClient: (id, data) => update({ id, data }), 
        deleteClient: remove,
        isCreating,
        isUpdating,
        isDeleting,
    };

    return (
        <ClientItemsContext.Provider value={value}>
            {children}
        </ClientItemsContext.Provider>
    );
};

export const useClientItemsContext = () => {
    const ctx = useContext(ClientItemsContext);
    if (!ctx) throw new Error("useClientItemsContext must be used within ClientItemsProvider");
    return ctx;
};