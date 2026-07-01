import { icons } from "common/data/icons";
import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── Tip ────────────────────────────────────────────────────────────────────
interface IconPickerProps {
    value: string;
    onChange: (icon: string) => void;
    placeholder?: string;
    disabled?: boolean; 
}

// ─── Yardımcı: icon adından okunabilir etiket ────────────────────────────────
const iconLabel = (cls: string) =>
    cls
        .replace(/^ri-/, "")
        .replace(/-(line|fill)$/, "")
        .replace(/-/g, " ");

// ─── Bileşen ─────────────────────────────────────────────────────────────────
export const IconPicker: React.FC<IconPickerProps> = ({
    value,
    onChange,
    placeholder = "İkon ara...",
    disabled
}) => {
    const [open, setOpen]       = useState(false);
    const [query, setQuery]     = useState("");
    const containerRef          = useRef<HTMLDivElement>(null);
    const searchRef             = useRef<HTMLInputElement>(null);

    // Dropdown dışına tıklanınca kapat
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Açıldığında search input'a odaklan
    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 50);
    }, [open]);

    const filtered = useCallback(() => {
        if (!query.trim()) return icons;
        const q = query.toLowerCase();
        return icons.filter((ic) => ic.toLowerCase().includes(q));
    }, [icons, query]);

    const handleSelect = (ic: string) => {
        onChange(ic);
        setOpen(false);
        setQuery("");
    };

    const results = filtered();

    return (
        <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
            <button
                type="button"
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
                title="İkon seç"
                style={{
                    opacity: disabled ? 0.5 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    fontWeight: 500,
                    border: "1px solid #dee2e6",
                    borderRadius: 6,
                    background: "#fff",
                    color: "#495057",
                    minWidth: 110,
                    transition: "border-color .15s, box-shadow .15s",
                    boxShadow: open ? "0 0 0 3px rgba(var(--vz-primary-rgb), 0.1);" : "none",
                    borderColor: open ? "#rgba(var(--vz-primary-rgb), 0.3);" : "#dee2e6",
                }}
            >
                <i className={`${value} fs-16`} style={{ color: "var(--vz-primary)" }} />
                <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 70 }}>
                    {iconLabel(value)}
                </span>
                <i className={`ri-arrow-${open ? "up" : "down"}-s-line`} style={{ color: "#adb5bd", fontSize: 14 }} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        zIndex: 1050,
                        background: "#fff",
                        border: "1px solid #dee2e6",
                        borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                        width: 280,
                        overflow: "hidden",
                        animation: "ipFadeIn .12s ease",
                    }}
                >
                    {/* Arama */}
                    <div style={{ padding: "8px 10px", borderBottom: "1px solid #f1f3f5" }}>
                        <div style={{ position: "relative" }}>
                            <i
                                className="ri-search-line"
                                style={{
                                    position: "absolute", left: 9, top: "50%",
                                    transform: "translateY(-50%)", color: "#adb5bd", fontSize: 14,
                                }}
                            />
                            <input
                                ref={searchRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                                style={{
                                    width: "100%", padding: "5px 8px 5px 30px",
                                    fontSize: 12, border: "1px solid #dee2e6", borderRadius: 6,
                                    outline: "none", color: "#495057", background: "#f8f9fa",
                                    boxSizing: "border-box",
                                }}
                                onFocus={(e) => (e.target.style.borderColor = "rgba(var(--vz-primary-rgb), 0.3)")}
                                onBlur={(e) => (e.target.style.borderColor = "#dee2e6")}
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    style={{
                                        position: "absolute", right: 7, top: "50%",
                                        transform: "translateY(-50%)", border: "none",
                                        background: "none", cursor: "pointer", padding: 0,
                                        color: "#adb5bd", fontSize: 14, lineHeight: 1,
                                    }}
                                >
                                    <i className="ri-close-line" />
                                </button>
                            )}
                        </div>
                        <div style={{ fontSize: 10, color: "#adb5bd", marginTop: 4 }}>
                            {results.length} ikon bulundu
                        </div>
                    </div>

                    {/* Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(6, 1fr)",
                            gap: 2,
                            padding: "8px 10px",
                            maxHeight: 240,
                            overflowY: "auto",
                        }}
                    >
                        {results.length === 0 ? (
                            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "20px 0", color: "#adb5bd", fontSize: 12 }}>
                                Sonuç bulunamadı
                            </div>
                        ) : (
                            results.map((ic) => (
                                <button
                                    key={ic}
                                    type="button"
                                    title={iconLabel(ic)}
                                    onClick={() => handleSelect(ic)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        aspectRatio: "1",
                                        border: "2px solid",
                                        borderColor: ic === value ? "var(--vz-primary)" : "transparent",
                                        borderRadius: 8,
                                        background: ic === value ? "#e7f1ff" : "transparent",
                                        cursor: "pointer",
                                        fontSize: 18,
                                        color: ic === value ? "var(--vz-primary)" : "#495057",
                                        transition: "all .1s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (ic !== value) {
                                            (e.currentTarget as HTMLButtonElement).style.background = "#f1f3f5";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (ic !== value) {
                                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                        }
                                    }}
                                >
                                    <i className={ic} />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Animasyon keyframe'i — bir kez enjekte et */}
            <style>{`
                @keyframes ipFadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};