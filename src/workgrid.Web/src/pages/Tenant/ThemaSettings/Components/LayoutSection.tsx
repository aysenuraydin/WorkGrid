import React from "react";
import { SectionTitle } from "./SectionTitle";
import { SubHead } from "./SectionTitle";
import { CardRadio } from "./CardRadio";
import {
    PVVertical,
    PVHorizontal,
    PVSemiBox,
    PVDark,
    PVCompact,
    PVPreloader,
} from "./LayoutPreviews";
import {
    TLayoutModeType,
    TLayoutPositionType,
    TLayoutType,
    TLayoutWidthType,
    TLeftSidebarSizeType,
    TLeftSidebarType,
    TPreloaderType,
    TTopbarThemeType,
    TenantConfig,
} from "common/data/TenantTypes";

interface LayoutSectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ values, set }) => {
    const isVertical   = values.layoutType === TLayoutType.VERTICAL;
    const isHorizontal = values.layoutType === TLayoutType.HORIZONTAL;
    const isSemiBox    = values.layoutType === TLayoutType.SEMIBOX;
    const isTwoColumn  = values.layoutType === TLayoutType.TWOCOLUMN;

    const setSidebarMode = (mode: "flat" | "gradient" | "custom") => {
        if (mode === "gradient") {
            set("isGradientSideBar", true);
            set("leftSidebarType", TLeftSidebarType.GRADIENT);
        } else if (mode === "flat") {
            set("isGradientSideBar", false);
            set("leftSidebarType", TLeftSidebarType.LIGHT);
        } else {
            set("isGradientSideBar", false);
            set("leftSidebarType", TLeftSidebarType.DARK);
        }
    };

    return (
        <div id="sec-layout" className="card">
            <div className="card-body" style={{ maxWidth: "800px", width: "100%" }}>
                <SectionTitle
                    icon="ri-layout-line"
                    title="Düzen & Görünüm"
                    subtitle="Sayfa şablonu ve sidebar boyutu — renk ayarları için 'Sidebar & Topbar' bölümünü kullan"
                />

                <SubHead title="Düzen Tipi" />
                <div className="d-flex gy-3 mb-2">
                    <CardRadio id="ly-t"  name="ly-layout" value={TLayoutType.TWOCOLUMN}   checked={isTwoColumn}   onChange={(v) => set("layoutType", v)} label="2 Kolon"    preview={<PVVertical />} />
                    <CardRadio id="ly-v"  name="ly-layout" value={TLayoutType.VERTICAL}    checked={isVertical}   onChange={(v) => set("layoutType", v)} label="Dikey"      preview={<PVVertical />} />
                    <CardRadio id="ly-h"  name="ly-layout" value={TLayoutType.HORIZONTAL}  checked={isHorizontal} onChange={(v) => set("layoutType", v)} label="Yatay"      preview={<PVHorizontal />} />
                    <CardRadio id="ly-sb" name="ly-layout" value={TLayoutType.SEMIBOX}     checked={isSemiBox}    onChange={(v) => set("layoutType", v)} label="Semi-Box"   preview={<PVSemiBox />} />
                </div>

                <SubHead title="Renk Modu" />
                <div className="row gy-3 g-2 mb-2">
                    <CardRadio id="ly-light" name="ly-mode" value={TLayoutModeType.LIGHTMODE} checked={values.layoutModeType === TLayoutModeType.LIGHTMODE} onChange={(v) => set("layoutModeType", v)} label="Açık" preview={<PVVertical />} />
                    <CardRadio id="ly-dark"  name="ly-mode" value={TLayoutModeType.DARKMODE}  checked={values.layoutModeType === TLayoutModeType.DARKMODE}  onChange={(v) => set("layoutModeType", v)} label="Koyu" preview={<PVDark />} dark />
                </div>

                <SubHead title="Topbar Rengi" />
                <div className="row gy-3 g-2 mb-2">
                    <CardRadio id="ly-tb-l" name="ly-topbar" value={TTopbarThemeType.LIGHT} checked={values.topbarThemeType === TTopbarThemeType.LIGHT} onChange={(v) => set("topbarThemeType", v)} label="Açık" preview={<PVVertical topbarDark={false} />} />
                    <CardRadio id="ly-tb-d" name="ly-topbar" value={TTopbarThemeType.DARK}  checked={values.topbarThemeType === TTopbarThemeType.DARK}  onChange={(v) => set("topbarThemeType", v)} label="Koyu" preview={<PVVertical topbarDark />} />
                </div>

                {(isVertical || isHorizontal) && (
                    <>
                        <SubHead title="Sayfa Genişliği" />
                        <div className="row gy-3 g-2 mb-2">
                            <CardRadio id="ly-w-f" name="ly-width" value={TLayoutWidthType.FLUID} checked={values.layoutWidthType === TLayoutWidthType.FLUID} onChange={(v) => set("layoutWidthType", v)} label="Akışkan" preview={<PVVertical />} />
                            <CardRadio id="ly-w-b" name="ly-width" value={TLayoutWidthType.BOXED} checked={values.layoutWidthType === TLayoutWidthType.BOXED} onChange={(v) => set("layoutWidthType", v)} label="Kutulu"  preview={<PVVertical />} />
                        </div>
                    </>
                )}

                {!isTwoColumn && (
                    <>
                        <SubHead title="Düzen Konumu" />
                        <div className="btn-group mb-3" role="group">
                            {[
                                { val: TLayoutPositionType.FIXED,      label: "Sabit" },
                                { val: TLayoutPositionType.SCROLLABLE, label: "Kaydırılabilir" },
                            ].map(({ val, label }) => (
                                <label
                                    key={val}
                                    className={`btn btn-sm ${values.layoutPositionType === val ? "btn-primary" : "btn-outline-primary"}`}
                                >
                                    <input
                                        type="radio"
                                        name="ly-pos"
                                        value={val}
                                        checked={values.layoutPositionType === val}
                                        onChange={() => set("layoutPositionType", val)}
                                        className="d-none"
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </>
                )}

                {(isVertical || isTwoColumn || isSemiBox) && (
                    <>
                        <SubHead title="Kenar Çubuğu Rengi" />
                        <p className="fs-11 text-muted mb-2">
                            <i className="ri-information-line me-1" />
                            Seçim, yukarıdaki <strong>Sidebar & Topbar</strong> bölümüyle senkronize çalışır.
                            Gradient seçersen kendi belirlediğin renkler kullanılır.
                        </p>
                        <div className="row gy-3 g-2 mb-2">
                            <CardRadio
                                id="ly-sb-l"
                                name="ly-sidebar"
                                value={TLeftSidebarType.LIGHT}
                                checked={values.leftSidebarType === TLeftSidebarType.LIGHT}
                                onChange={(v) => { set("leftSidebarType", v); setSidebarMode("flat"); }}
                                label="Açık"
                                preview={<PVVertical />}
                            />
                            <CardRadio
                                id="ly-sb-d"
                                name="ly-sidebar"
                                value={TLeftSidebarType.DARK}
                                checked={values.leftSidebarType === TLeftSidebarType.DARK}
                                onChange={(v) => { set("leftSidebarType", v); setSidebarMode("custom"); }}
                                label="Koyu"
                                preview={<PVVertical sidebarDark />}
                            />
                            <CardRadio
                                id="ly-sb-gr"
                                name="ly-sidebar"
                                value={TLeftSidebarType.GRADIENT}
                                checked={values.leftSidebarType === TLeftSidebarType.GRADIENT}
                                onChange={(v) => { set("leftSidebarType", v); setSidebarMode("gradient"); }}
                                label="Gradient"
                                preview={<PVVertical sidebarGradient />}
                            />
                        </div>
                    </>
                )}

                {(isVertical || isSemiBox) && (
                    <>
                        <SubHead title="Kenar Çubuğu Boyutu" />
                        <div className="row gy-3 g-2 mb-2">
                            <CardRadio id="ly-sz-d" name="ly-size" value={TLeftSidebarSizeType.DEFAULT} checked={values.leftSidebarSizeType === TLeftSidebarSizeType.DEFAULT} onChange={(v) => set("leftSidebarSizeType", v)} label="Varsayılan" preview={<PVVertical />} />
                            <CardRadio id="ly-sz-c" name="ly-size" value={TLeftSidebarSizeType.COMPACT} checked={values.leftSidebarSizeType === TLeftSidebarSizeType.COMPACT} onChange={(v) => set("leftSidebarSizeType", v)} label="Kompakt"    preview={<PVCompact />} />
                        </div>
                    </>
                )}

                <SubHead title="Preloader" />
                <div className="row gy-3 g-2 mb-2">
                    <CardRadio id="ly-pr-on"  name="ly-pre" value={TPreloaderType.ENABLE}  checked={values.preloader === TPreloaderType.ENABLE}  onChange={(v) => set("preloader", v)} label="Açık"   preview={<PVPreloader />} />
                    <CardRadio id="ly-pr-off" name="ly-pre" value={TPreloaderType.DISABLE} checked={values.preloader === TPreloaderType.DISABLE} onChange={(v) => set("preloader", v)} label="Kapalı" preview={<PVVertical />} />
                </div>
            </div>
        </div>
    );
};