// hooks/useThemeMode.ts
import { useSyncExternalStore, useCallback } from "react";
import { useTenantContext } from "context/TenantContext";

const STORAGE_KEY = "userThemeMode";


const listeners = new Set<() => void>();

const getSnapshot = (): string | null => {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", onStorage);
    };
};

const setStored = (value: string) => {
    try {
        localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    listeners.forEach((l) => l());
};

export const useThemeMode = () => {
    const { config: tenantConfig } = useTenantContext(); 

    const stored = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const mode = stored || tenantConfig?.layoutModeType || "light";

    const setUserMode = useCallback((next: string) => {
        setStored(next);
    }, []);

    const toggle = useCallback(() => {
        setStored(mode === "dark" ? "light" : "dark");
    }, [mode]);

    return { mode, setUserMode, toggle, isDark: mode === "dark" };
};

export default useThemeMode;