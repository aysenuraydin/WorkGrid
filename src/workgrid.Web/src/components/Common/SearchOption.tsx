import { useAuth } from 'context/AuthContext';
import { useTenantContext } from 'context/TenantContext';
import { useUserProfile } from 'hooks/useUser';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from 'reactstrap';
import SimpleBar from "simplebar-react";

const STORAGE_KEY = "recentSearches";
const MAX_RECENT = 10;

// localStorage yardımcıları
const loadRecent = (): string[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
    } catch {
        return [];
    }
};

const saveRecent = (list: string[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
        /* sessizce geç */
    }
};

const SearchOption = () => {
    const { config: tenantConfig } = useTenantContext(); 
    const { user: usr } = useAuth(); 
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

    const [value, setValue] = useState<string>("");
    const [recent, setRecent] = useState<string[]>([]);
    const navigate = useNavigate();

    // İlk yüklemede localStorage'tan oku
    useEffect(() => {
        setRecent(loadRecent());
    }, []);

    // Bir terimi son aramalara ekle (en yeni başa, tekrar yok, max 10)
    const pushRecent = useCallback((term: string) => {
        const t = term.trim();
        if (!t) return;
        setRecent((prev) => {
            const next = [t, ...prev.filter((x) => x.toLowerCase() !== t.toLowerCase())]
                .slice(0, MAX_RECENT);
            saveRecent(next);
            return next;
        });
    }, []);

    const onChangeData = (v: string) => setValue(v);

    // Arama yap: kaydet + sonuç sayfasına git
    const handleSearch = useCallback((term?: string) => {
        const trimmed = (term ?? value).trim();
        if (!trimmed) return;
        pushRecent(trimmed);
        navigate(`/search-results?q=${encodeURIComponent(trimmed)}`);
        setValue("");
        // dropdown'u kapat
        const dropdown = document.getElementById("search-dropdown");
        dropdown?.classList.remove("show");
    }, [value, navigate, pushRecent]);

    // Tek terimi sil
    const removeRecent = (term: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRecent((prev) => {
            const next = prev.filter((x) => x !== term);
            saveRecent(next);
            return next;
        });
    };

    // Tümünü temizle
    const clearRecent = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRecent([]);
        saveRecent([]);
    };

    // Dropdown aç/kapa davranışı (orijinal mantık korundu)
    useEffect(() => {
        const searchOptions = document.getElementById("search-close-options") as HTMLElement;
        const dropdown = document.getElementById("search-dropdown") as HTMLElement;
        const searchInput = document.getElementById("search-options") as HTMLInputElement;
        if (!searchOptions || !dropdown || !searchInput) return;

        const showDropdown = () => {
            dropdown.classList.add("show");
            searchOptions.classList.remove("d-none");
        };
        const onFocus = () => showDropdown();          // odaklanınca her zaman aç (son aramaları göster)
        const onKeyup = () => showDropdown();

        const onClearClick = () => {
            searchInput.value = "";
            setValue("");
            dropdown.classList.remove("show");
            searchOptions.classList.add("d-none");
        };

        const onBodyClick = (e: any) => {
            const insideDropdown = dropdown.contains(e.target);
            if (e.target.getAttribute("id") !== "search-options" && !insideDropdown) {
                dropdown.classList.remove("show");
                searchOptions.classList.add("d-none");
            }
        };

        searchInput.addEventListener("focus", onFocus);
        searchInput.addEventListener("keyup", onKeyup);
        searchOptions.addEventListener("click", onClearClick);
        document.body.addEventListener("click", onBodyClick);

        return () => {
            searchInput.removeEventListener("focus", onFocus);
            searchInput.removeEventListener("keyup", onKeyup);
            searchOptions.removeEventListener("click", onClearClick);
            document.body.removeEventListener("click", onBodyClick);
        };
    }, []);

    if(!(tenantConfig.showBLog || tenantConfig.showECommerce || tenantConfig.showCrm || isAdmin)) return;
    return (
        <React.Fragment>
            <form className="app-search d-none d-md-block"
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            >
                <div className="position-relative">
                    <Input type="text" className="form-control" placeholder="Ara..."
                        id="search-options"
                        value={value}
                        autoComplete="off"
                        name="wg-no-autofill"
                        role="presentation"
                        onChange={(e) => onChangeData(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                    />
                    <span className="mdi mdi-magnify search-widget-icon"></span>
                    <span className="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
                        id="search-close-options"></span>
                </div>

                <div className="dropdown-menu dropdown-menu-lg" id="search-dropdown">
                    <SimpleBar style={{ maxHeight: "320px" }}>

                        {/* ── Son Aramalar ── */}
                        <div className="dropdown-header d-flex align-items-center justify-content-between">
                            <h6 className="text-overflow text-muted mb-0 text-uppercase">Son Aramalar</h6>
                            {recent.length > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-link btn-sm p-0 text-muted text-decoration-none"
                                    onClick={clearRecent}
                                >
                                    Temizle
                                </button>
                            )}
                        </div>

                        {recent.length === 0 ? (
                            <div className="dropdown-item bg-transparent text-muted fs-13">
                                Henüz arama yapmadınız.
                            </div>
                        ) : (
                            <div className="dropdown-item bg-transparent text-wrap">
                                {recent.map((term) => (
                                    <span
                                        key={term}
                                        className="btn btn-soft-primary btn-sm rounded-pill me-1 mb-1 d-inline-flex align-items-center gap-1"
                                        onClick={() => handleSearch(term)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {term}
                                        <i
                                            className="mdi mdi-close ms-1"
                                            onClick={(e) => removeRecent(term, e)}
                                            style={{ cursor: "pointer" }}
                                            title="Kaldır"
                                        />
                                    </span>
                                ))}
                            </div>
                        )}

                    </SimpleBar>

                    <div className="text-center pt-3 pb-1" onClick={() => handleSearch()}>
                        <span className="btn btn-primary btn-sm">
                            Tüm Sonuçları Gör
                            <i className="ri-arrow-right-line ms-1"></i>
                        </span>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
};

export default SearchOption;