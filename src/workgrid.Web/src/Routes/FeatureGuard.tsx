import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useGetTenantConfig } from 'hooks/useTenant';
import { useUserProfile } from 'hooks/useUser';

interface GuardProps {
    children?: React.ReactNode; 
    featureKey?: string;     
    allowedRoles?: string[]; 
}

export const FeatureGuard = ({ children, featureKey, allowedRoles }: GuardProps) => {
    const { user: usr } = useAuth();
    const { data: tenantConfig, isLoading: isTenantLoading } = useGetTenantConfig();
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");

    if (isTenantLoading || isUserLoading) {
        return <div>Yükleniyor...</div>;
    }

    if (!children) {
        let defaultPath = tenantConfig?.mainView || "/dashboard";

        if (defaultPath === "/settings" && !user?.roles?.includes("WG")) {
            defaultPath = "/documents";  
        }

        return <Navigate to={defaultPath} replace />;
    }

    if (featureKey && featureKey !== "" && tenantConfig) {
        const isFeatureEnabled = tenantConfig[featureKey as keyof typeof tenantConfig];

        if (!isFeatureEnabled) {
            const isCrmFallbackAllowed =
                featureKey === "showCrm" &&
                (tenantConfig.showBLog || tenantConfig.showECommerce);

            if (!isCrmFallbackAllowed) {
                return <Navigate to="/dashboard" replace />;
            }
        }
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const hasRole = user?.roles?.some((role: string) => allowedRoles.includes(role));
        if (!hasRole) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
};