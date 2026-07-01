import React from "react"; 
import { TenantConfig } from "common/data/TenantTypes";
import { SectionTitle } from "./SectionTitle";
import { ColorField } from "./ColorField";

const COLOR_FIELDS = [
    { key: "primaryColor",   label: "Primary" },
    { key: "secondaryColor", label: "Secondary" },
    { key: "successColor",   label: "Success" },
    { key: "dangerColor",    label: "Danger" },
    { key: "warningColor",   label: "Warning" },
    { key: "infoColor",      label: "Info" },
    { key: "lightColor",     label: "Light" },
    { key: "darkColor",      label: "Dark" },
];

interface ColorPaletteSectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
}

export const ColorPaletteSection: React.FC<ColorPaletteSectionProps> = ({ values, set }) => (
    <div id="sec-renkler" className="card mb-5">
        <div className="card-body">
            <SectionTitle
                icon="ri-palette-line"
                title="Renk Paleti"
                subtitle="CSS Variables katmanına enjekte edilir"
            />
            <div className="row g-3">
                {COLOR_FIELDS.map(({ key, label }) => (
                    <div className="col-6 col-sm-4 col-md-3" key={key}>
                        <ColorField
                            label={label}
                            value={(values as any)[key] ?? ""}
                            onChange={(v) => set(key, v)}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);