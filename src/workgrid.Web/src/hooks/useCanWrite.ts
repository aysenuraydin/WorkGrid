import { AccessLevel } from "common/data/Datatable";
import { useAuth } from "context/AuthContext";
import { useGetTableAccess } from "hooks/useDatatables";
import { useEffect } from "react";

const isAdminRole = (role?: string) => role === "WG" || role === "Admin";

export const useCanWrite = (tableId?: number) => {
    const { data: access } = useGetTableAccess(tableId);
    const { user } = useAuth();
    const role = user?.roles?.[0];

    useEffect(()=>{
        console.log("data",access);
        console.log("tableId",tableId);
    },[tableId, access])

    if (!access) return false;
    if (isAdminRole(role)) return true;

    switch (access.writeAccess) {
        case AccessLevel.Public:
        case AccessLevel.Authenticated:
        case AccessLevel.Owner:
            return true;
        case AccessLevel.RoleBased: {
            const allowed = (access.writeRequiredRole ?? "")
                .split(",").map((s: string) => s.trim()).filter(Boolean);
            return allowed.some((r: string) => r.toLowerCase() === (role ?? "").toLowerCase());
        }
        default:
            return false;
    }
};