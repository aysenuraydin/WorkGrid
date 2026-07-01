import React, { useState } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import AnglePicker from "components/Common/AnglePicker";
import { TBackgroundImageType, TenantConfig } from "common/data/TenantTypes";
import { SectionTitle } from "./SectionTitle";
import { ColorField } from "./ColorField";
import { CardRadio } from "./CardRadio";
import classnames from "classnames";
interface BackgroundSectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
    tenantConfig: TenantConfig;
}

export const BackgroundSection: React.FC<BackgroundSectionProps> = ({ values, set, tenantConfig }) => {
    const [bgMode, setBgMode]         = useState<"preset" | "url">("preset");
    const [bgUrl, setBgUrl]           = useState(values.bgImgUrl ?? "");
    const [bgSize, setBgSize]         = useState("cover");
    const [bgRepeat, setBgRepeat]     = useState("no-repeat");
    const [bgPosition, setBgPosition] = useState("center");

    const isFlatActive    = !values.isGradientBg && !values.isBgImg && (values as any).isBgFlat;
    const isGradientActive = values.isGradientBg;
    const isImgActive      = values.isBgImg;

    const toggleBgOption = (option: "flat" | "gradient" | "img") => {
        const isFlat     = option === "flat";
        const isGradient = option === "gradient";
        const isImg      = option === "img";

        const currentlyActive =
            (isFlat && isFlatActive) ||
            (isGradient && isGradientActive) ||
            (isImg && isImgActive);

        set("isBgFlat",     isFlat     && !currentlyActive);
        set("isGradientBg", isGradient && !currentlyActive);
        set("isBgImg",      isImg      && !currentlyActive);
    };

const BgToggleCard = ({
    option,
    active,
    icon,
    title,
    description,
}: {
    option: "flat" | "gradient" | "img";
    active: boolean;
    icon: string;
    title: string;
    description: string;
}) => (
    <div className="col-sm-4">
        <div
            className={classnames(
                "border rounded p-3 d-flex align-items-start gap-3 h-100", 
                { "border-primary": active, "border-light": !active } // Aktif değilse border'ı hafiflet
            )}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => toggleBgOption(option)}
        >
            {/* İkon rengi: Aktifse primary, değilse text-muted */}
            <i className={`${icon} fs-20 mt-1 ${active ? "text-primary" : "text-muted"}`} />
            
            <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-medium fs-13">{title}</span>
                    <div className="form-check form-switch mb-0">
                        <input
                            type="checkbox"
                            // Sınıfı dinamikleştiriyoruz: Aktifse primary, değilse light/secondary
                            className={classnames("form-check-input border-primary", {
                                "bg-primary": active,
                                "bg-light": !active 
                            })}
                            role="switch"
                            checked={active}
                            onChange={(e) => {
                                set("isBgFlat",     option === "flat"     ? e.target.checked : false);
                                set("isGradientBg", option === "gradient" ? e.target.checked : false);
                                set("isBgImg",      option === "img"      ? e.target.checked : false);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
                <p className="text-muted fs-11 mb-0 mt-1">{description}</p>
            </div>
        </div>
    </div>
);

    return (
        <div id="sec-bg" className="card mb-4">
            <div className="card-body">
                <SectionTitle
                    icon="ri-landscape-line"
                    title="Sistem Geneli Arka Plan"
                    subtitle="Sayfa zemini için düz renk, gradient veya görsel katmanı (Kapatmak için aktif karta tekrar tıklayın)"
                />

                <div className="row g-2 mb-3">
                    <BgToggleCard
                        option="flat"
                        active={isFlatActive}
                        icon="ri-stop-circle-line"
                        title="Düz Renk"
                        description="Sayfa zemininde tek ton mat renk"
                    />
                    <BgToggleCard
                        option="gradient"
                        active={isGradientActive}
                        icon="ri-contrast-drop-line"
                        title="Arka Planda Gradient"
                        description="Sayfa zemininde degrade geçiş efekti"
                    />
                    <BgToggleCard
                        option="img"
                        active={isImgActive}
                        icon="ri-image-2-line"
                        title="Arka Plan Görseli"
                        description="Hazır desen eller veya URL'den resim"
                    />
                </div>

                {/* Düz Renk alt panel */}
                {isFlatActive && (
                    <div className="row g-3 mb-3 animate-fade-in">
                        <div className="col-sm-4">
                            <ColorField
                                label="Arka Plan Rengi"
                                value={(values as any).bgSolidColor ?? "#f8fafc"}
                                onChange={(v) => set("bgSolidColor", v)}
                            />
                        </div>
                        <div className="col-12">
                            <div
                                className="border rounded"
                                style={{ height: 32, background: (values as any).bgSolidColor ?? "#f8fafc" }}
                            />
                        </div>
                    </div>
                )}

                {/* Gradient alt panel */}
                {isGradientActive && (
                    <div className="row g-3 mb-3 animate-fade-in">
                        <div className="col-sm-6">
                            <ColorField
                                label="BG Gradient İlk Renk"
                                value={values.bgFirstColor}
                                onChange={(v) => set("bgFirstColor", v)}
                            />
                        </div>
                        <div className="col-sm-6">
                            <ColorField
                                label="BG Gradient İkinci Renk"
                                value={values.bgSecondColor}
                                onChange={(v) => set("bgSecondColor", v)}
                            />
                        </div>
                        <div className="col-12 d-flex align-items-center gap-2">
                            <div
                                className="border rounded flex-grow-1"
                                style={{
                                    height: 32,
                                    background: `linear-gradient(${values.deg}deg, ${values.bgFirstColor}, ${values.bgSecondColor})`,
                                }}
                            />
                            <div style={{ width: 120, flexShrink: 0 }}>
                                <AnglePicker
                                    value={Number(tenantConfig.deg)}
                                    onChange={(angle) => set("deg", String(angle))}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Görsel / desen alt panel */}
                {isImgActive && (
                    <div className="border rounded p-3 animate-fade-in">
                        <div className="d-flex gap-2 mb-3">
                            {(["preset", "url"] as const).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setBgMode(m)}
                                    className={`btn btn-sm ${bgMode === m ? "btn-primary" : "btn-outline-primary"}`}
                                >
                                    <i className={`me-1 ${m === "preset" ? "ri-layout-grid-line" : "ri-links-line"}`} />
                                    {m === "preset" ? "Hazır Desenler" : "Özel URL"}
                                </button>
                            ))}
                        </div>

                        {bgMode === "preset" ? (
                            <div className="row g-2">
                                <CardRadio
                                    id="bg-none"
                                    name="bg-sel"
                                    value={TBackgroundImageType.NONE}
                                    checked={values.backgroundImageType === TBackgroundImageType.NONE}
                                    onChange={(v: string) => { set("backgroundImageType", v); set("bgImgUrl", ""); }}
                                    label="Yok"
                                    preview={<div className="bg-light h-100 w-100" />}
                                />
                                {[
                                    { val: TBackgroundImageType.IMG1, label: "Desen 1" },
                                    { val: TBackgroundImageType.IMG2, label: "Desen 2" },
                                ].map(({ val, label }) => (
                                    <CardRadio
                                        key={val}
                                        id={`bg-${val}`}
                                        name="bg-sel"
                                        value={val}
                                        checked={values.backgroundImageType === val}
                                        onChange={(v: string) => { set("backgroundImageType", v); set("bgImgUrl", ""); }}
                                        label={label}
                                        preview={<div className="bg-light h-100 w-100" />}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>
                                <FormGroup className="mb-3">
                                    <Label className="fs-12 fw-medium text-muted text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>
                                        Görsel URL
                                    </Label>
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text"><i className="ri-image-line" /></span>
                                        <Input
                                            bsSize="sm"
                                            value={bgUrl}
                                            onChange={(e) => setBgUrl(e.target.value)}
                                            placeholder="https://example.com/pattern.png"
                                        />
                                        {bgUrl && (
                                            <Button
                                                size="sm"
                                                color="danger"
                                                outline
                                                onClick={() => { setBgUrl(""); set("isBgImg", false); set("bgImgUrl", ""); }}
                                            >
                                                <i className="ri-close-line" />
                                            </Button>
                                        )}
                                    </div>
                                </FormGroup>

                                <div className="row g-2 mb-3">
                                    {[
                                        { lbl: "Size",     val: bgSize,     setter: setBgSize,     opts: ["cover", "contain", "auto"] },
                                        { lbl: "Repeat",   val: bgRepeat,   setter: setBgRepeat,   opts: ["no-repeat", "repeat", "repeat-x", "repeat-y"] },
                                        { lbl: "Position", val: bgPosition, setter: setBgPosition, opts: ["center", "top", "bottom", "left", "right"] },
                                    ].map(({ lbl, val, setter, opts }) => (
                                        <div className="col-4" key={lbl}>
                                            <Label className="fs-12 fw-medium text-muted text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>
                                                {lbl}
                                            </Label>
                                            <Input
                                                type="select"
                                                bsSize="sm"
                                                value={val}
                                                onChange={(e) => setter(e.target.value)}
                                            >
                                                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                                            </Input>
                                        </div>
                                    ))}
                                </div>

                                {bgUrl && (
                                    <div className="mb-3">
                                        <Label className="fs-12 fw-medium text-muted text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>
                                            Önizleme
                                        </Label>
                                        <div
                                            className="border rounded"
                                            style={{
                                                height: 80,
                                                backgroundImage: `url('${bgUrl}')`,
                                                backgroundSize: bgSize,
                                                backgroundRepeat: bgRepeat,
                                                backgroundPosition: bgPosition,
                                            }}
                                        />
                                    </div>
                                )}

                                <Button
                                    size="sm"
                                    color="primary"
                                    className="w-100"
                                    disabled={!bgUrl.trim()}
                                    onClick={() => {
                                        if (!bgUrl.trim()) return;
                                        set("backgroundImageType", TBackgroundImageType.NONE);
                                        set("bgImgUrl", `${bgUrl.trim()}?size=${bgSize}&repeat=${bgRepeat}&pos=${bgPosition}`);
                                    }}
                                >
                                    <i className="ri-check-line me-1" />Uygula
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};