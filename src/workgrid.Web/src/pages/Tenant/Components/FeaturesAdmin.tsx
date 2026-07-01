import React, { useState, useEffect } from "react";
import { useFeaturesContext } from "context/FeaturesContext";
import { IFeatureItem, IFeatureDetail, ICtaConfig } from "common/data/tenant";
import config from "config";
import { SectionHead } from "./SectionHead";
import { IconPicker } from "components/Common/Iconpicker";
import { HeroAdminPage } from "./HeroAdminPage";
import useThemeMode from "hooks/useThemeMode";
import { LogoUploadField } from "../ThemaSettings/Components/LogoUploadField"; 

const tokens = {
    accent:        "var(--vz-primary)",
    accentLight:   "rgba(var(--vz-primary-rgb), .12)",
    accentBorder:  "rgba(var(--vz-primary-rgb), .35)",
    danger:        "var(--vz-danger)",
    dangerLight:   "rgba(var(--vz-danger-rgb), .12)",
    success:       "var(--vz-success)",
    successLight:  "rgba(var(--vz-success-rgb), .12)",
    muted:         "var(--vz-secondary-color, #6b7280)",
    mutedLight:    "var(--vz-tertiary-bg, #f9fafb)",
    border:        "var(--vz-border-color, #e5e7eb)",
    text:          "var(--vz-body-color, #111827)",
    textSoft:      "var(--vz-secondary-color, #374151)",
    radius:    "10px",
    radiusSm:  "6px",
    shadow:      "0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.04)",
    shadowHover: "0 4px 12px rgba(var(--vz-primary-rgb), .12), 0 1px 3px rgba(0,0,0,.05)",
};
const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: ".07em",
    textTransform: "uppercase",
    color: tokens.muted,
    marginBottom: 4,
    display: "block",
};

const sectionTitle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    color: tokens.muted,
    display: "flex",
    alignItems: "center",
    gap: 6,
};

// ─── FeatureCard ─────────────────────────────────────────────────────────────
interface FeatureCardProps {
    item: IFeatureItem;
    index: number;
    isMutating: boolean;
    onChange: (id: string | number, field: keyof IFeatureItem, value: any) => void;
    onAddDetail: (id: string | number) => void;
    onRemoveDetail: (fId: string | number, dId: string | number) => void;
    onUpdateDetail: (fId: string | number, dId: string | number, field: keyof IFeatureDetail, val: string | boolean) => void;
    onSave: (item: IFeatureItem) => void;
    onDelete: (id: string | number) => void;
    onMarkForDeletion: (fileName: string) => void;
    isNew: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    item, index, isMutating,
    onChange, onAddDetail, onRemoveDetail, onUpdateDetail,
    onSave, onDelete, onMarkForDeletion, isNew
}) => {
    const [open, setOpen] = useState(isNew);

    return (
        <div
            style={{
                background: "#fff00000",
                border: `1px solid ${isNew ? tokens.accentBorder : tokens.border}`,
                borderLeft: `3px solid ${isNew ? tokens.accent : tokens.border}`,
                borderRadius: tokens.radius,
                boxShadow: open ? tokens.shadowHover : tokens.shadow,
                marginBottom: 12,
                overflow: "hidden",
                transition: "box-shadow .2s ease",
            }}
        >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 16px",
                    cursor: "pointer",
                    background: open ? tokens.accentLight : tokens.mutedLight,
                    borderBottom: open ? `1px solid ${tokens.accentBorder}` : "1px solid transparent",
                    transition: "background .15s",
                    userSelect: "none",
                }}
            >
                {/* Index badge */}
                <span style={{
                    minWidth: 24, height: 24,
                    borderRadius: "50%",
                    background: open ? tokens.accent : "#d1d5db",
                    color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "background .15s",
                }}>
                    {index + 1}
                </span>

                {/* Icon */}
                {item.iconUrl && (
                    <i className={item.iconUrl} style={{ fontSize: 16, color: open ? tokens.accent : tokens.muted, flexShrink: 0 }} />
                )}

                {/* Title */}
                <span style={{
                    flexGrow: 1,
                    fontSize: 14,
                    fontWeight: 600,
                    color: item.title ? tokens.text : tokens.muted,
                    fontStyle: item.title ? "normal" : "italic",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>
                    {item.title || "Başlıksız özellik bölümü"}
                </span>

                {/* Chips */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}
                    onClick={e => e.stopPropagation()}>
                    {/* Layout toggle */}
                    <button
                        onClick={() => onChange(item.id!, "isRight", !item.isRight)}
                        style={{
                            border: `1px solid ${tokens.accentBorder}`,
                            borderRadius: tokens.radiusSm,
                            background: item.isRight ? tokens.accent : "#fff",
                            color: item.isRight ? "#fff" : tokens.muted,
                            fontSize: 11, fontWeight: 600,
                            padding: "2px 8px",
                            cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 4,
                            transition: "all .15s",
                        }}
                        title="Görsel konumunu değiştir"
                    >
                        <i className={`ri-layout-${item.isRight ? "right" : "left"}-line`} style={{ fontSize: 12 }} />
                        {item.isRight ? "Sağ" : "Sol"}
                    </button>
                </div>

                <i className={`ri-arrow-${open ? "up" : "down"}-s-line`}
                    style={{ color: tokens.muted, fontSize: 16, flexShrink: 0 }} />
            </div>

            {/* ── Body ────────────────────────────────────────────────────── */}
            {open && (
                <div style={{ padding: "20px 20px 0" }}>
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

                        {/* COL 1 – Görsel & renk */}
                        <div style={{ flex: "0 0 220px", minWidth: 0 }}>
                            <p style={sectionTitle}>
                                <i className="ri-image-line" />Görsel & Renk
                            </p>
                            <div style={{
                                background: tokens.mutedLight,
                                border: `1px solid ${tokens.border}`,
                                borderRadius: tokens.radius,
                                padding: 12,
                                marginTop: 8,
                            }}>
                                <LogoUploadField
                                    label="Bölüm Görseli"
                                    badge={item.isRight ? "Sağ Blok" : "Sol Blok"}
                                    badgeColor={item.isRight ? "info" : "secondary"}
                                    bg="bg-light"
                                    accept="image/*"
                                    value={item.imageUrl || ""}
                                    onChange={(fileName) => onChange(item.id!, "imageUrl", fileName)}
                                    onMarkForDeletion={onMarkForDeletion}
                                    heightValue={undefined}
                                    onHeightChange={undefined}
                                    isHeightHidden={false}
                                />
                            </div>

                            {/* Background color */}
                            <div style={{ marginTop: 14 }}>
                                <label style={labelStyle}>Arka Plan Rengi</label>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <input
                                        type="color"
                                        value={item.bgColor || "#f8f9fa"}
                                        onChange={e => onChange(item.id!, "bgColor", e.target.value)}
                                        style={{
                                            width: 32, height: 32, padding: 2,
                                            border: `1px solid ${tokens.border}`,
                                            borderRadius: tokens.radiusSm,
                                            cursor: "pointer", flexShrink: 0,
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={item.bgColor || "#f8f9fa"}
                                        onChange={e => onChange(item.id!, "bgColor", e.target.value)}
                                        maxLength={7}
                                        placeholder="#f8f9fa"
                                        style={{
                                            flex: 1, fontSize: 13,
                                            border: `1px solid ${tokens.border}`,
                                            borderRadius: tokens.radiusSm,
                                            padding: "4px 8px",
                                            fontFamily: "monospace",
                                            outline: "none",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Preview swatch */}
                            <div style={{
                                marginTop: 8,
                                height: 32,
                                background: item.bgColor || "#f8f9fa",
                                borderRadius: tokens.radiusSm,
                                border: `1px solid ${tokens.border}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <span style={{ fontSize: 10, color: tokens.muted, fontWeight: 600 }}>ÖNIZLEME</span>
                            </div>

                            {/* Layout toggle (full) */}
                            <div style={{ marginTop: 14 }}>
                                <label style={labelStyle}>Görsel Konumu</label>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {[false, true].map(right => (
                                        <button
                                            key={String(right)}
                                            onClick={() => onChange(item.id!, "isRight", right)}
                                            style={{
                                                flex: 1, padding: "5px 0",
                                                border: `1px solid ${item.isRight === right ? tokens.accent : tokens.border}`,
                                                borderRadius: tokens.radiusSm,
                                                background: item.isRight === right ? tokens.accentLight : "#fff",
                                                color: item.isRight === right ? tokens.accent : tokens.muted,
                                                fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                                                transition: "all .15s",
                                            }}
                                        >
                                            <i className={`ri-layout-${right ? "right" : "left"}-line`} />
                                            {right ? "Sağda" : "Solda"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COL 2 – Metin */}
                        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                            <p style={sectionTitle}>
                                <i className="ri-text" />İçerik
                            </p>

                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                {/* Order */}
                                <div style={{ flex: "0 0 68px" }}>
                                    <label style={labelStyle}>Sıra</label>
                                    <input
                                        type="number"
                                        value={item.orderNumber}
                                        onChange={e => onChange(item.id!, "orderNumber", parseInt(e.target.value) || 0)}
                                        style={{
                                            width: "100%", padding: "5px 8px", fontSize: 13,
                                            border: `1px solid ${tokens.border}`, borderRadius: tokens.radiusSm,
                                            outline: "none",
                                        }}
                                    />
                                </div>
                                {/* Subtitle */}
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Üst Etiket</label>
                                    <input
                                        type="text"
                                        value={item.subTitle || ""}
                                        onChange={e => onChange(item.id!, "subTitle", e.target.value)}
                                        placeholder="Design, Analytics, CRM…"
                                        style={{
                                            width: "100%", padding: "5px 8px", fontSize: 13,
                                            border: `1px solid ${tokens.border}`, borderRadius: tokens.radiusSm,
                                            outline: "none", boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Icon */}
                            <div style={{ marginTop: 12 }}>
                                <label style={labelStyle}>Başlık İkonu</label>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "6px 10px",
                                    border: `1px solid ${tokens.border}`,
                                    borderRadius: tokens.radiusSm,
                                    background: tokens.mutedLight,
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: tokens.accentLight,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        <i className={item.iconUrl || "ri-collage-line"}
                                            style={{ fontSize: 16, color: tokens.accent }} />
                                    </div>
                                    <IconPicker
                                        value={item.iconUrl!}
                                        onChange={e => onChange(item.id!, "iconUrl", e)}
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div style={{ marginTop: 12 }}>
                                <label style={labelStyle}>
                                    Ana Başlık <span style={{ color: tokens.danger }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={e => onChange(item.id!, "title", e.target.value)}
                                    placeholder="Hizmet veya özellik başlığı"
                                    style={{
                                        width: "100%", padding: "6px 10px", fontSize: 14,
                                        fontWeight: 600,
                                        border: `1px solid ${item.title ? tokens.border : tokens.danger}`,
                                        borderRadius: tokens.radiusSm, outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ marginTop: 12 }}>
                                <label style={labelStyle}>Açıklama</label>
                                <textarea
                                    rows={5}
                                    value={item.description || ""}
                                    onChange={e => onChange(item.id!, "description", e.target.value)}
                                    placeholder="Landing sayfasında görünecek detaylı açıklama..."
                                    style={{
                                        width: "100%", padding: "6px 10px", fontSize: 13,
                                        border: `1px solid ${tokens.border}`,
                                        borderRadius: tokens.radiusSm, outline: "none",
                                        resize: "vertical", lineHeight: 1.5,
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        </div>

                        {/* COL 3 – Alt detaylar */}
                        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <p style={sectionTitle}>
                                    <i className="ri-node-tree" />Alt Detaylar
                                    {item.featuresDetails?.length > 0 && (
                                        <span style={{
                                            background: tokens.accent, color: "#fff",
                                            borderRadius: 99, fontSize: 10, fontWeight: 700,
                                            padding: "1px 6px", marginLeft: 4,
                                        }}>
                                            {item.featuresDetails.length}
                                        </span>
                                    )}
                                </p>
                                <button
                                    onClick={() => onAddDetail(item.id!)}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 4,
                                        padding: "4px 10px", fontSize: 12, fontWeight: 600,
                                        border: `1px solid ${tokens.accentBorder}`,
                                        borderRadius: tokens.radiusSm,
                                        background: tokens.accentLight,
                                        color: tokens.accent, cursor: "pointer",
                                    }}
                                >
                                    <i className="ri-add-line" />Ekle
                                </button>
                            </div>

                            <div style={{
                                marginTop: 10,
                                maxHeight: 280, overflowY: "auto",
                                border: `1px solid ${tokens.border}`,
                                borderRadius: tokens.radius,
                                background: tokens.mutedLight,
                            }}>
                                {(item.featuresDetails || []).length === 0 ? (
                                    <div style={{
                                        padding: "28px 16px", textAlign: "center",
                                        color: tokens.muted, fontSize: 12, fontStyle: "italic",
                                    }}>
                                        <i className="ri-inbox-line" style={{ fontSize: 24, display: "block", marginBottom: 6, opacity: .5 }} />
                                        Henüz madde yok. "Ekle" butonuna tıklayın.
                                    </div>
                                ) : (
                                    <div>
                                        {(item.featuresDetails || []).map((detail, di) => (
                                            <div key={detail.id} style={{
                                                display: "flex", alignItems: "center", gap: 6,
                                                padding: "7px 10px",
                                                borderBottom: di < item.featuresDetails.length - 1
                                                    ? `1px solid ${tokens.border}` : "none",
                                                background: "#fff",
                                            }}>
                                                {/* Approved toggle */}
                                                <button
                                                    onClick={() => onUpdateDetail(item.id!, detail.id!, "isApproved", !detail.isApproved)}
                                                    title="Durumu değiştir"
                                                    style={{
                                                        width: 22, height: 22, flexShrink: 0,
                                                        border: "none", borderRadius: 6, cursor: "pointer",
                                                        background: detail.isApproved ? tokens.successLight : tokens.dangerLight,
                                                        color: detail.isApproved ? tokens.success : tokens.danger,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    <i className={detail.isApproved ? "ri-check-line" : "ri-close-line"} />
                                                </button>

                                                {/* Value */}
                                                <input
                                                    type="text"
                                                    value={detail.value || ""}
                                                    onChange={e => onUpdateDetail(item.id!, detail.id!, "value", e.target.value)}
                                                    placeholder="Değer"
                                                    style={{
                                                        width: 56, flexShrink: 0,
                                                        padding: "3px 6px", fontSize: 12,
                                                        border: `1px solid ${tokens.border}`,
                                                        borderRadius: tokens.radiusSm, outline: "none",
                                                    }}
                                                />

                                                {/* Label */}
                                                <input
                                                    type="text"
                                                    value={detail.label || ""}
                                                    onChange={e => onUpdateDetail(item.id!, detail.id!, "label", e.target.value)}
                                                    placeholder="Madde metni"
                                                    style={{
                                                        flex: 1, minWidth: 0,
                                                        padding: "3px 6px", fontSize: 12,
                                                        border: `1px solid ${tokens.border}`,
                                                        borderRadius: tokens.radiusSm, outline: "none",
                                                    }}
                                                />

                                                {/* Delete */}
                                                <button
                                                    onClick={() => onRemoveDetail(item.id!, detail.id!)}
                                                    style={{
                                                        width: 22, height: 22, flexShrink: 0,
                                                        border: "none", borderRadius: 6, cursor: "pointer",
                                                        background: tokens.dangerLight,
                                                        color: tokens.danger,
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 12,
                                                    }}
                                                >
                                                    <i className="ri-delete-bin-line" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Actions ─────────────────────────────────────────── */}
                    <div style={{
                        display: "flex", justifyContent: "flex-end", gap: 8,
                        padding: "14px 0 16px",
                        borderTop: `1px solid ${tokens.border}`,
                        marginTop: 20,
                    }}>
                        <button
                            onClick={() => onDelete(item.id!)}
                            disabled={isMutating}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "6px 14px", fontSize: 13, fontWeight: 600,
                                border: `1px solid #fca5a5`,
                                borderRadius: tokens.radiusSm,
                                background: tokens.dangerLight,
                                color: tokens.danger, cursor: "pointer",
                            }}
                        >
                            <i className="ri-delete-bin-line" />Bölümü Sil
                        </button>
                        <button
                            onClick={() => onSave(item)}
                            disabled={isMutating || !item.title}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "6px 18px", fontSize: 13, fontWeight: 600,
                                border: "none",
                                borderRadius: tokens.radiusSm,
                                background: !item.title ? "#d1d5db" : tokens.accent,
                                color: "#fff", cursor: !item.title ? "not-allowed" : "pointer",
                                boxShadow: !item.title ? "none" : "0 2px 8px rgba(79,70,229,.35)",
                            }}
                        >
                            <i className={isMutating ? "ri-loader-4-line" : "ri-save-line"} />
                            {isMutating ? "Kaydediliyor…" : "Kaydet"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Ana Admin Bileşeni ──────────────────────────────────────────────────────
export const FeaturesAdmin = () => {
    const { isDark } = useThemeMode(); 
    const {
        features, ctaConfig,
        isLoading, isError, isMutating,
        createFeature, updateFeature, deleteFeature, updateCta,
    } = useFeaturesContext();

    const [activeTab, setActiveTab] = useState("1");
    const [localFeatures, setLocalFeatures] = useState<IFeatureItem[]>([]);
    const [localCta, setLocalCta] = useState<ICtaConfig>({ text: "", buttonText: "", buttonUrl: "" });

    useEffect(() => { if (features) setLocalFeatures(features); }, [features]);
    useEffect(() => { if (ctaConfig) setLocalCta(ctaConfig); }, [ctaConfig]);

    const [markedForDeletionFiles, setMarkedForDeletionFiles] = useState<string[]>([]);
    const handleMarkForDeletion = (fileName: string) => {
        if (!fileName) return;
        setMarkedForDeletionFiles(prev => prev.includes(fileName) ? prev : [...prev, fileName]);
    };

    if (isLoading) return (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div className="spinner-border" style={{ color: tokens.accent }} />
            <p style={{ color: tokens.muted, marginTop: 12, fontSize: 14 }}>Yükleniyor…</p>
        </div>
    );
    if (isError) return (
        <div style={{ textAlign: "center", padding: "60px 0", color: tokens.danger }}>
            <i className="ri-error-warning-line" style={{ fontSize: 36, display: "block", marginBottom: 8 }} />
            <p style={{ fontSize: 14 }}>Veriler yüklenirken bir hata oluştu.</p>
        </div>
    );

    const addFeature = () => {
        setLocalFeatures(prev => [...prev, {
            id: Date.now(),
            title: "", subTitle: "", description: "",
            imageUrl: "", iconUrl: "ri-collage-line",
            orderNumber: prev.length + 1,
            isRight: prev.length % 2 !== 0,
            bgColor: "#f8f9fa",
            featuresDetails: [],
        }]);
    };

    const updateFeatureField = (id: number | string, field: keyof IFeatureItem, value: any) =>
        setLocalFeatures(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));

    const removeFeature = (id: number | string) => {
        if (features.some(f => f.id === id)) deleteFeature(id);
        setLocalFeatures(prev => prev.filter(f => f.id !== id));
    };

    const addDetail = (featureId: number | string) =>
        setLocalFeatures(prev => prev.map(f =>
            f.id !== featureId ? f : {
                ...f,
                featuresDetails: [...(f.featuresDetails || []),
                    { id: Date.now(), label: "", value: "", isApproved: true }]
            }
        ));

    const removeDetail = (featureId: number | string, detailId: number | string) =>
        setLocalFeatures(prev => prev.map(f =>
            f.id !== featureId ? f : {
                ...f,
                featuresDetails: f.featuresDetails.filter(d => d.id !== detailId)
            }
        ));

    const updateDetailField = (
        featureId: number | string, detailId: number | string,
        field: keyof IFeatureDetail, value: string | boolean
    ) =>
        setLocalFeatures(prev => prev.map(f =>
            f.id !== featureId ? f : {
                ...f,
                featuresDetails: f.featuresDetails.map(d =>
                    d.id === detailId ? { ...d, [field]: value } : d
                )
            }
        ));

    const saveFeatureRecord = (item: IFeatureItem) => {
        const payload: IFeatureItem = {
            ...item,
            featuresDetails: item.featuresDetails.map(d => ({
                label: d.label,
                value: d.value || null,
                isApproved: d.isApproved
            })) as any,
        };
        features.some(f => f.id === item.id)
            ? updateFeature({ id: item.id!, data: payload })
            : createFeature(payload);
    };

    // ── Tab definitions ───────────────────────────────────────────────────────
    const tabs = [
        { id: "1", icon: "ri-layout-masonry-line", label: "Özellik Bölümleri", count: localFeatures.length },
        { id: "2", icon: "ri-megaphone-line", label: "CTA Bandı" },
        { id: "3", icon: "ri-layout-top-line", label: "Başlık" },
    ];

    return (
        <React.Fragment>
            <SectionHead
                icon="ri-layout-masonry-line"
                title="Özellik Yönetimi"
                subtitle="Tanıtım bölümlerini, görsel yönlerini, renklerini ve CTA bandını yönetin."
                action={
                    activeTab === "1" ? (
                        <button
                            onClick={addFeature}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "7px 16px", fontSize: 13, fontWeight: 600,
                                border: "none", borderRadius: tokens.radiusSm,
                                background: tokens.accent, color: "#fff", cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(var(--vz-primary-rgb), 0.3)",
                            }}
                        >
                            <i className="ri-add-line" />Yeni Bölüm
                        </button>
                    ) : null
                }
            />

            {/* ── Custom Tab Bar ─────────────────────────────────────────── */}
            <div style={{
                display: "flex", gap: 4,
                padding: "4px",
                background: tokens.mutedLight,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.radius,
                marginBottom: 20,
                width: "fit-content",
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "6px 14px", fontSize: 13, fontWeight: 600,
                            border: "none", borderRadius: 7, cursor: "pointer",
                            background: activeTab === tab.id ? "#fff" : "transparent",
                            color: activeTab === tab.id ? tokens.accent : tokens.muted,
                            boxShadow: activeTab === tab.id ? tokens.shadow : "none",
                            transition: "all .15s",
                        }}
                    >
                        <i className={tab.icon} style={{ fontSize: 14 }} />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span style={{
                                background: activeTab === tab.id ? tokens.accent : "#d1d5db",
                                color: "#fff",
                                borderRadius: 99, fontSize: 10, fontWeight: 700,
                                padding: "1px 6px",
                                transition: "background .15s",
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── TAB 1: Özellik Bölümleri ──────────────────────────────── */}
            {activeTab === "1" && (
                <div>
                    {localFeatures.length === 0 ? (
                        <div style={{
                            border: `2px dashed ${tokens.border}`,
                            borderRadius: tokens.radius,
                            textAlign: "center",
                            padding: "60px 20px",
                            background: tokens.mutedLight,
                        }}>
                            <i className="ri-layout-masonry-line" style={{
                                fontSize: 40, display: "block",
                                marginBottom: 12, color: "#d1d5db",
                            }} />
                            <p style={{ fontSize: 14, color: tokens.muted, marginBottom: 16 }}>
                                Henüz bir tanıtım bölümü eklenmemiş.
                            </p>
                            <button
                                onClick={addFeature}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    padding: "7px 18px", fontSize: 13, fontWeight: 600,
                                    border: `1px solid ${tokens.accentBorder}`,
                                    borderRadius: tokens.radiusSm,
                                    background: tokens.accentLight,
                                    color: tokens.accent, cursor: "pointer",
                                }}
                            >
                                <i className="ri-add-line" />İlk bölümü ekle
                            </button>
                        </div>
                    ) : (
                        localFeatures.map((item, index) => (
                            <FeatureCard
                                key={item.id}
                                item={item}
                                index={index}
                                isMutating={isMutating}
                                isNew={String(item.id).startsWith("temp-")}
                                onChange={updateFeatureField}
                                onAddDetail={addDetail}
                                onRemoveDetail={removeDetail}
                                onUpdateDetail={updateDetailField}
                                onSave={saveFeatureRecord}
                                onDelete={removeFeature}
                                onMarkForDeletion={handleMarkForDeletion}
                            />
                        ))
                    )}
                </div>
            )}

            {/* ── TAB 2: CTA ────────────────────────────────────────────── */}
            {activeTab === "2" && (
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {/* Form */}
                    <div style={{
                        flex: "1 1 300px",
                        background: "#fff",
                        border: `1px solid ${tokens.border}`,
                        borderRadius: tokens.radius,
                        padding: 24,
                        boxShadow: tokens.shadow,
                    }}>
                        <h6 style={{
                            fontSize: 13, fontWeight: 700, color: tokens.text,
                            display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                        }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: tokens.accentLight,
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <i className="ri-megaphone-line" style={{ color: tokens.accent, fontSize: 14 }} />
                            </div>
                            CTA Bant İçeriği
                        </h6>

                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Slogan Yazısı</label>
                            <input
                                type="text"
                                value={localCta.text}
                                onChange={e => setLocalCta(p => ({ ...p, text: e.target.value }))}
                                placeholder="Build your web App/SaaS with Workgrid…"
                                style={{
                                    width: "100%", padding: "7px 10px", fontSize: 13,
                                    border: `1px solid ${tokens.border}`, borderRadius: tokens.radiusSm,
                                    outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Buton Metni</label>
                                <input
                                    type="text"
                                    value={localCta.buttonText}
                                    onChange={e => setLocalCta(p => ({ ...p, buttonText: e.target.value }))}
                                    placeholder="Buy Now"
                                    style={{
                                        width: "100%", padding: "7px 10px", fontSize: 13,
                                        border: `1px solid ${tokens.border}`, borderRadius: tokens.radiusSm,
                                        outline: "none", boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Buton URL</label>
                                <input
                                    type="text"
                                    value={localCta.buttonUrl}
                                    onChange={e => setLocalCta(p => ({ ...p, buttonUrl: e.target.value }))}
                                    placeholder="/register"
                                    style={{
                                        width: "100%", padding: "7px 10px", fontSize: 13,
                                        border: `1px solid ${tokens.border}`, borderRadius: tokens.radiusSm,
                                        outline: "none", boxSizing: "border-box",
                                        fontFamily: "monospace",
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ textAlign: "right", marginTop: 20 }}>
                            <button
                                onClick={() => updateCta(localCta)}
                                disabled={isMutating || !localCta.text}
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 6,
                                    padding: "7px 18px", fontSize: 13, fontWeight: 600,
                                    border: "none", borderRadius: tokens.radiusSm,
                                    background: !localCta.text ? "#d1d5db" : tokens.accent,
                                    color: "#fff",
                                    cursor: !localCta.text ? "not-allowed" : "pointer",
                                    boxShadow: !localCta.text ? "none" : "0 2px 8px rgba(79,70,229,.3)",
                                }}
                            >
                                <i className="ri-save-3-line" />
                                {isMutating ? "Kaydediliyor…" : "Güncelle"}
                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div style={{
                        flex: "1 1 300px",
                        background: "#fff",
                        border: `1px solid ${tokens.border}`,
                        borderRadius: tokens.radius,
                        padding: 24,
                        boxShadow: tokens.shadow,
                    }}>
                        <h6 style={{
                            fontSize: 13, fontWeight: 700, color: tokens.text,
                            display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                        }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 8,
                                background: "#f0fdf4",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <i className="ri-eye-line" style={{ color: tokens.success, fontSize: 14 }} />
                            </div>
                            Canlı Önizleme
                        </h6>

                        <div style={{
                            background: `linear-gradient(135deg, ${tokens.accent}, var(--vz-primary-rgb))`,
                            borderRadius: tokens.radius,
                            padding: "20px 24px",
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between", gap: 16,
                            flexWrap: "wrap",
                        }}>
                            <span style={{
                                color: "#fff", fontWeight: 600, fontSize: 15,
                                opacity: localCta.text ? 1 : .5,
                            }}>
                                {localCta.text || "Slogan buraya gelecek…"}
                            </span>
                            <button style={{
                                padding: "8px 20px",
                                background: "#ef4444",
                                border: "none", borderRadius: tokens.radiusSm,
                                color: "#fff", fontWeight: 700, fontSize: 13,
                                cursor: "default",
                                boxShadow: "0 2px 8px rgba(239,68,68,.4)",
                                display: "flex", alignItems: "center", gap: 6,
                            }}>
                                <i className="ri-shopping-cart-2-line" />
                                {localCta.buttonText || "Buy Now"}
                            </button>
                        </div>

                        {localCta.buttonUrl && (
                            <p style={{ fontSize: 11, color: tokens.muted, marginTop: 8, fontFamily: "monospace" }}>
                                → {localCta.buttonUrl}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── TAB 3: Başlık ─────────────────────────────────────────── */}
            {activeTab === "3" && <HeroAdminPage />}

        </React.Fragment>
    );
};

