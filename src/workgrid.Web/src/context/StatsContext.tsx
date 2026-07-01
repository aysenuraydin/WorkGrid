import React, { createContext, useContext, ReactNode } from "react";
import { useGetStats, useUpdateStats } from "hooks/useStats";
import { IStatsSection } from "common/data/tenant";

interface StatsContextValue {
    stats: IStatsSection | undefined;
    isLoading: boolean;
    isError: boolean;
    saveStats: (data: IStatsSection) => void;
    isSaving: boolean;
}

const StatsContext = createContext<StatsContextValue | undefined>(undefined);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, isError } = useGetStats();
    const { mutate: saveStats, isPending: isSaving } = useUpdateStats();

    const value: StatsContextValue = {
        stats: data,
        isLoading, 
        isError,
        saveStats,
        isSaving,
    };

    return (
        <StatsContext.Provider value={value}>
            {children}
        </StatsContext.Provider>
    );
};

export const useStatsContext = () => {
    const ctx = useContext(StatsContext);
    if (!ctx) throw new Error("useStatsContext must be used within StatsProvider");
    return ctx;
};
