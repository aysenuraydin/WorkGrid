import { useMemo, useState } from "react";

// ── hooks/useUserSearch.ts ────────────────────────────────────────────────────
export const useUserSearch = (users: any[] | undefined) => {
    const [searchTerm,   setSearchTerm]   = useState("");
    const [roleFilter,   setRoleFilter]   = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [activeRole,   setActiveRole]   = useState("");

    const applyFilter = () => {
        setActiveSearch(searchTerm);
        setActiveRole(roleFilter);
    };

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter((u: any) => {
            const q = activeSearch.toLowerCase().trim();
            const matchesText = !q ||
                `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
                (u.username ?? "").toLowerCase().includes(q) ||
                (u.email    ?? "").toLowerCase().includes(q);

            const matchesRole = !activeRole ||
                (u.roles ?? []).some((r: string) =>
                    r.toLowerCase() === activeRole.toLowerCase()
                );

            return matchesText && matchesRole;
        });
    }, [users, activeSearch, activeRole]);

    // Mevcut rollerin unique listesi (select için)
    const allRoles = useMemo(() => {
        if (!users) return [];
        return Array.from(
            new Set(users.flatMap((u: any) => u.roles ?? []))
        ) as string[];
    }, [users]);

    return {
        searchTerm, setSearchTerm,
        roleFilter, setRoleFilter,
        applyFilter,
        filteredUsers,
        allRoles,
    };
};

