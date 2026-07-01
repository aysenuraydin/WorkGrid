import React from "react";
import AnglePicker from "components/Common/AnglePicker";
import { TenantConfig } from "common/data/TenantTypes";
import { SectionTitle } from "./SectionTitle";
import { ColorField } from "./ColorField";

interface SidebarTopbarSectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
}

export const SidebarTopbarSection: React.FC<SidebarTopbarSectionProps> = ({ values, set }) => {
    const gradientModeButtons = (
        isGradient: boolean,
        onToggle: (mode: boolean) => void,
    ) => (
        <div className="d-flex gap-2 mb-3 flex-wrap">
            {[
                { mode: false, label: "Düz Renk", icon: "ri-stop-circle-line" },
                { mode: true,  label: "Gradient", icon: "ri-contrast-2-line" },
            ].map(({ mode, label, icon }) => (
                <button
                    key={String(mode)}
                    type="button"
                    onClick={() => onToggle(mode)}
                    className={`btn btn-sm ${isGradient === mode ? "btn-primary" : "btn-outline-secondary"}`}
                >
                    <i className={`${icon} me-1`} />{label}
                </button>
            ))}
        </div>
    );

    return (
        <div id="sec-cubuk" className="card mb-5">
            <div className="card-body">
                <SectionTitle
                    icon="ri-layout-left-line"
                    title="Sidebar & Topbar Renkleri"
                    subtitle="Seçtiğin renkler doğrudan sidebar/topbar'a CSS variable olarak enjekte edilir"
                />

                {/* ── SIDEBAR ── */}
                <p className="fw-semibold fs-13 mb-2">Sidebar</p>
                {gradientModeButtons(values.isGradientSideBar, (mode) => set("isGradientSideBar", mode))}

                <div className="row g-3 mb-2">
                    {!values.isGradientSideBar ? (
                        <div className="col-sm-6">
                            <ColorField
                                label="Sidebar Arka Planı"
                                value={values.sidebarBg}
                                onChange={(v) => set("sidebarBg", v)}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="col-sm-6">
                                <ColorField
                                    label="Başlangıç Rengi"
                                    value={values.sideBarFirstColor}
                                    onChange={(v) => set("sideBarFirstColor", v)}
                                />
                            </div>
                            <div className="col-sm-6">
                                <ColorField
                                    label="Bitiş Rengi"
                                    value={values.sideBarSecondColor}
                                    onChange={(v) => set("sideBarSecondColor", v)}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Sidebar gradient önizleme + açı */}
                <div className="mt-1 mb-4 d-flex align-items-center gap-2">
                    <div
                        className="border rounded overflow-hidden flex-grow-1"
                        style={{ height: 28 }}
                    >
                        <div
                            className="h-100 w-100"
                            style={{
                                background: values.isGradientSideBar
                                    ? `linear-gradient(${values.sideBarDeg}deg, ${values.sideBarFirstColor}, ${values.sideBarSecondColor})`
                                    : values.sidebarBg,
                            }}
                        />
                    </div>
                    {values.isGradientSideBar && (
                        <div style={{ width: 120, flexShrink: 0 }}>
                            <AnglePicker
                                value={Number(values.sideBarDeg)}
                                onChange={(angle) => set("sideBarDeg", String(angle))}
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar yazı rengi + canlı önizleme */}
                <div className="row g-3 my-2">
                    <div className="col-sm-6">
                        <ColorField
                            label="Sidebar Yazı Rengi"
                            value={values.sidebarTextColor}
                            onChange={(v) => set("sidebarTextColor", v)}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label className="fs-12 fw-medium text-muted mb-1 d-block">Önizleme</label>
                        <div
                            className="border rounded d-flex align-items-center px-3 gap-2"
                            style={{
                                height: 34,
                                background: values.isGradientSideBar
                                    ? `linear-gradient(${values.sideBarDeg}deg, ${values.sideBarFirstColor}, ${values.sideBarSecondColor})`
                                    : values.sidebarBg,
                            }}
                        >
                            <i className="ri-home-line fs-14" style={{ color: values.sidebarTextColor }} />
                            <span className="fs-12" style={{ color: values.sidebarTextColor }}>Menü Öğesi</span>
                        </div>
                    </div>
                </div>

                <hr className="text-muted opacity-25 my-3" />

                {/* ── TOPBAR ── */}
                <p className="fw-semibold fs-13 mb-2">Topbar</p>
                {gradientModeButtons(values.isGradientTopbar, (mode) => set("isGradientTopbar", mode))}

                <div className="row g-3 mb-2">
                    {!values.isGradientTopbar ? (
                        <div className="col-sm-6">
                            <ColorField
                                label="Topbar Arka Planı"
                                value={values.topbarBg}
                                onChange={(v) => set("topbarBg", v)}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="col-sm-6">
                                <ColorField
                                    label="Başlangıç Rengi"
                                    value={values.topbarFirstColor}
                                    onChange={(v) => set("topbarFirstColor", v)}
                                />
                            </div>
                            <div className="col-sm-6">
                                <ColorField
                                    label="Bitiş Rengi"
                                    value={values.topbarSecondColor}
                                    onChange={(v) => set("topbarSecondColor", v)}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Topbar gradient önizleme + açı */}
                <div className="mt-1 d-flex align-items-center gap-2">
                    <div
                        className="border rounded overflow-hidden flex-grow-1"
                        style={{ height: 28 }}
                    >
                        <div
                            className="h-100 w-100"
                            style={{
                                background: values.isGradientTopbar
                                    ? `linear-gradient(${values.topbarDeg}deg, ${values.topbarFirstColor}, ${values.topbarSecondColor})`
                                    : values.topbarBg,
                            }}
                        />
                    </div>
                    {values.isGradientTopbar && (
                        <div style={{ width: 120, flexShrink: 0 }}>
                            <AnglePicker
                                value={Number(values.topbarDeg)}
                                onChange={(angle) => set("topbarDeg", String(angle))}
                            />
                        </div>
                    )}
                </div>

                {/* Topbar yazı rengi + canlı önizleme */}
                <div className="row g-3 m-2">
                    <div className="col-sm-6">
                        <ColorField
                            label="Topbar Yazı Rengi"
                            value={values.topbarTextColor}
                            onChange={(v) => set("topbarTextColor", v)}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label className="fs-12 fw-medium text-muted mb-1 d-block">Önizleme</label>
                        <div
                            className="border rounded d-flex align-items-center px-3 gap-2"
                            style={{
                                height: 34,
                                background: values.isGradientTopbar
                                    ? `linear-gradient(${values.topbarDeg}deg, ${values.topbarFirstColor}, ${values.topbarSecondColor})`
                                    : values.topbarBg,
                            }}
                        >
                            <i className="ri-search-line fs-14" style={{ color: values.topbarTextColor }} />
                            <span className="fs-12" style={{ color: values.topbarTextColor }}>Başlık</span>
                            <i className="ri-notification-line fs-14 ms-auto" style={{ color: values.topbarTextColor }} />
                        </div>
                    </div>
                </div>

                <p className="fs-11 text-muted mt-3 mb-0">
                    <i className="ri-information-line me-1" />
                    Seçtiğin renkler CSS --wg-sidebar-bg and --wg-topbar-bg variable'larına enjekte edilir.
                </p>
            </div>
        </div>
    );
};