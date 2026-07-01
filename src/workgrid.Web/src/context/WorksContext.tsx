import React, { createContext, useContext, ReactNode } from "react";
import {
    useGetWorks,
    useCreateWork,
    useUpdateWork,
    useDeleteWork,
} from "hooks/useWorks";
import { IProject } from "common/data/tenant";

interface WorksContextValue {
    works: IProject[];
    isLoading: boolean;
    isError: boolean;
    createWork: (data: IProject) => void;
    updateWork: (id: string, data: Partial<IProject>) => void;
    deleteWork: (id: string) => void;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

const WorksContext = createContext<WorksContextValue | undefined>(undefined);

export const WorksProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetWorks();
    const { mutate: create, isPending: isCreating } = useCreateWork();
    const { mutate: update, isPending: isUpdating } = useUpdateWork();
    const { mutate: remove, isPending: isDeleting } = useDeleteWork();

    const value: WorksContextValue = {
        works: data ?? [],
        isLoading,
        isError,
        createWork: create,
        updateWork: (id, data) => update({ id, data }),
        deleteWork: remove,
        isCreating,
        isUpdating,
        isDeleting,
    };

    return (
        <WorksContext.Provider value={value}>
            {children}
        </WorksContext.Provider>
    );
};

export const useWorksContext = () => {
    const ctx = useContext(WorksContext);
    if (!ctx) throw new Error("useWorksContext must be used within WorksProvider");
    return ctx;
};


