import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import {
    useGetTenantConfig,
    useUpdateTenantConfig,
    useResetTenantConfig,
} from "hooks/useTenant";

import { TenantConfig, workgridDefaultTenant } from "common/data/TenantTypes";

function dtoToConfig(dto: any): TenantConfig {
    return {
        ...workgridDefaultTenant,
        ...dto
    };
}

function configToDto(config: TenantConfig): any {
    return config;
}

interface TenantContextValue {
    config:          TenantConfig;
    isDirty:         boolean;
    isSaving:        boolean;
    isLoading:       boolean;
    update:          (partial: Partial<TenantConfig>) => void;
    save:            (explicitConfig?: TenantConfig) => Promise<void>;
    reset:           () => Promise<void>;
    applyThemeToDom: () => void;
}

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {

    const { data: serverDto, isLoading } = useGetTenantConfig();
    const { mutateAsync: updateConfig, isPending: isSaving } = useUpdateTenantConfig();
    const { mutateAsync: resetConfig } = useResetTenantConfig();

    const [localConfig, setLocalConfig] = useState<TenantConfig | null>(null);

    useEffect(() => {
        setLocalConfig(null);
    }, [serverDto]);

    const serverConfig: TenantConfig = serverDto
        ? dtoToConfig(serverDto)
        : workgridDefaultTenant;

    const config  = localConfig ?? serverConfig;
    const isDirty = localConfig !== null;

    const update = useCallback(
        (partial: Partial<TenantConfig>) =>
            setLocalConfig((prev) => ({
                ...(prev ?? serverConfig),
                ...partial
            })),
        [serverConfig]
    );

    const save = useCallback(async (explicitConfig?: TenantConfig) => { 
        const configToSave = explicitConfig || config; 
        if (!explicitConfig && !isDirty) return;

        await updateConfig(configToDto(configToSave));
        setLocalConfig(null);
    }, [isDirty, config, updateConfig]);

    const reset = useCallback(async () => {
        await resetConfig();
        setLocalConfig(null);
    }, [resetConfig]);

    const applyThemeToDom = useCallback(() => {
        const fontFamily = config.fontFamily;
        if (!fontFamily) return;

        const fontName = fontFamily.replace(/['"]/g, "").split(",")[0].trim();
        let fontLink = document.getElementById("tenant-font") as HTMLLinkElement | null;
        if (!fontLink) {
            fontLink = document.createElement("link");
            fontLink.id  = "tenant-font";
            fontLink.rel = "stylesheet";
            document.head.appendChild(fontLink);
        }
        fontLink.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700&display=swap`;

        document.documentElement.setAttribute("data-layout", config.layoutType);
        document.documentElement.setAttribute("data-sidebar", config.leftSidebarType);
        document.documentElement.setAttribute("data-layout-mode", config.layoutModeType);
        document.documentElement.setAttribute("data-sidebar-size", config.leftSidebarSizeType);
        document.documentElement.setAttribute("data-topbar", config.topbarThemeType);
        document.documentElement.setAttribute("data-layout-width", config.layoutWidthType);
        document.documentElement.setAttribute("data-sidebar-image", config.leftSidebarImageType);
        document.documentElement.setAttribute("data-layout-position", config.layoutPositionType);
        document.documentElement.setAttribute("data-preloader", config.preloader);

    }, [
        config.fontFamily,
        config.layoutType,
        config.leftSidebarType,
        config.layoutModeType,
        config.leftSidebarSizeType,
        config.topbarThemeType,
        config.layoutWidthType,
        config.leftSidebarImageType,
        config.layoutPositionType,
        config.preloader
    ]);

    return (
        <TenantContext.Provider
            value={{ config, isDirty, isSaving, isLoading, update, save, reset, applyThemeToDom }}
        >
            {children}
        </TenantContext.Provider>
    );
}

export function useTenantContext(): TenantContextValue {
    const ctx = useContext(TenantContext);
    if (!ctx) throw new Error("useTenantContext must be used inside <TenantProvider>");
    return ctx;
}