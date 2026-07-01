import React from "react";
import { TenantConfig } from "common/data/TenantTypes";
import { SectionTitle } from "./SectionTitle";
import { LogoUploadField } from "./LogoUploadField";

const LOGO_FIELDS = [
    {
        key: "logoSmUrl",
        heightKey: "logoSmHeight",
        label: "Küçük Logo",
        badge: "SMALL",
        badgeColor: "success",
        bg: "bg-white",
        accept: ".png,.jpg,.jpeg,.svg,.webp",
    },
    {
        key: "logoLightUrl",
        heightKey: "logoLightHeight",
        label: "Açık Tema Logosu",
        badge: "LIGHT",
        badgeColor: "secondary",
        bg: "bg-white",
        accept: ".png,.jpg,.jpeg,.svg,.webp",
    },
    {
        key: "logoDarkUrl",
        heightKey: "logoDarkHeight",
        label: "Koyu Tema Logosu",
        badge: "DARK",
        badgeColor: "dark",
        bg: "bg-dark",
        accept: ".png,.jpg,.jpeg,.svg,.webp",
    },
    {
        key: "faviconUrl",
        heightKey: null,
        label: "Favicon",
        badge: ".ICO",
        badgeColor: "primary",
        bg: "bg-light",
        accept: ".ico,.png,.svg",
    },
];

interface LogoFaviconSectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
    onMarkForDeletion: (url: string) => void;
}

export const LogoFaviconSection: React.FC<LogoFaviconSectionProps> = ({
    values,
    set,
    onMarkForDeletion,
}) => (
    <div id="sec-logo" className="card mb-5">
        <div className="card-body">
            <SectionTitle
                icon="ri-image-line"
                title="Logo & Favicon"
                subtitle="Açık/koyu tema logoları ve tarayıcı sekmesi ikonu"
            />
            <div className="row g-3">
                {LOGO_FIELDS.map(({ key, heightKey, label, badge, badgeColor, bg, accept }) => (
                    <div className="col-12 col-md-3" key={key}>
                        <LogoUploadField
                            label={label}
                            badge={badge}
                            badgeColor={badgeColor}
                            bg={bg}
                            accept={accept}
                            value={(values as any)[key] ?? ""}
                            onChange={(fileName) => set(key, fileName)}
                            onMarkForDeletion={onMarkForDeletion}
                            heightValue={heightKey ? ((values as any)[heightKey] ?? "") : undefined}
                            onHeightChange={heightKey ? (v) => set(heightKey, v) : undefined}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);