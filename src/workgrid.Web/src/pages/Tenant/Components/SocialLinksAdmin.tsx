import React, { useState, useEffect } from "react";
import {
    Button, Card, CardBody, Input, 
} from "reactstrap";

import { ISocialLink } from "common/data/tenant";
import { IconPicker } from "components/Common/Iconpicker";
import { createSocialLink } from "helpers/backend_helper";
import { useSocialLinksContext } from "context/SocialLinksContext";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import { useTenantContext } from "context/TenantContext";
import { getContrastIconClass } from "common/utils/getContrastIconClass";

const PLATFORM_OPTIONS = [
    { label: "Instagram",   icon: "ri-instagram-line",       value: "instagram" },
    { label: "Twitter/X",   icon: "ri-twitter-x-line",       value: "twitter" },
    { label: "LinkedIn",    icon: "ri-linkedin-box-line",     value: "linkedin" },
    { label: "GitHub",      icon: "ri-github-line",           value: "github" },
    { label: "Facebook",    icon: "ri-facebook-circle-line",  value: "facebook" },
    { label: "YouTube",     icon: "ri-youtube-line",          value: "youtube" },
    { label: "Dribbble",    icon: "ri-dribbble-line",         value: "dribbble" },
    { label: "Web / Diğer", icon: "ri-global-line",           value: "web" },
];

export const SocialLinksAdmin = () => {
    const { links, isLoading, isError, updateLink, deleteLink, isUpdating, isDeleting } = useSocialLinksContext();
    const { config: tenantConfig } = useTenantContext(); 
    
    // State'imizin tipini genişleterek kontrol bayraklarını ekliyoruz
    const [localLinks, setLocalLinks] = useState<(ISocialLink & { isNew?: boolean; isDirty?: boolean; isDeleted?: boolean })[]>([]);

    useEffect(() => { 
        if (links && links.length > 0) {
            setLocalLinks(links); 
        } 
    }, [links]);

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;

    // Yeni eleman ekleme (isNew bayrağı ile)
    const add = () =>
        setLocalLinks(prev => [...prev, { id: Date.now().toString(), platform: "web", iconUrl: "ri-global-line", url: "", isNew: true }]);

    // Arayüzden anında kaldırmak yerine arka planda silindi (isDeleted) olarak işaretleme
    const remove = (id: string) => {
        setLocalLinks(prev => prev.map(l => 
            l.id === id ? { ...l, isDeleted: true, isDirty: true } : l
        ));
    };

    // Input veya Select değiştiğinde tetiklenen fonksiyon
    const update = (id: string, field: keyof ISocialLink, value: string) => {
        setLocalLinks(prev => prev.map(l => {
            if (l.id !== id) return l;
            if (field === "platform") {
                const opt = PLATFORM_OPTIONS.find(p => p.value === value);
                return { ...l, platform: value, iconUrl: opt?.icon ?? "ri-global-line", isDirty: true };
            }
            return { ...l, [field]: value, isDirty: true };
        }));
    };

    // Tüm değişiklikleri (Create, Update, Delete) tek seferde kaydetme
    const saveAll = async () => {
        // Döngünün async/await ile senkron çalışabilmesi için for...of kullanıyoruz
        for (const link of localLinks) {
            const payload = {
                platform: link.platform,
                iconUrl: link.iconUrl,
                url: link.url
            };

            if (link.isDeleted) {
                // Eğer ürün yeniyse ve hiç kaydedilmeden silindiyse API'ye istek atmaya gerek yok
                if (!link.isNew) {
                    await deleteLink(link.id);
                }
            } 
            else if (link.isNew) {
                await createSocialLink(payload);
            } 
            else if (link.isDirty) {
                await updateLink(link.id, payload);
            }
        }
    };

    return (
        <div>
            <SectionHead
                icon="ri-share-line"
                title="Sosyal medya bağlantıları"
                // Silinmemiş olan aktif linklerin sayısını gösterir
                subtitle={`Footer ve profil bölümlerinde görüntülenir (Toplam ${localLinks.filter(x => !x.isDeleted).length} bağlantı)`}
                action={<Button color="primary" size="sm" onClick={add}><i className="ri-add-line me-1" />Ekle</Button>}
            />

            <div className="vstack gap-2">
                {localLinks
                    .filter(link => !link.isDeleted) 
                    .map(link => {
                        return (
                            <Card key={link.id} className="mb-0 border border-2">
                                <CardBody className="p-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center flex-shrink-0">
                                            <i className={`${link.iconUrl} ${getContrastIconClass("var(--vz-primary)")} fs-20`}/>
                                        </div>
                                        <IconPicker
                                            value={link.platform}
                                            onChange={e => update(link.id, "platform", e)}
                                        />
                                        <Input 
                                            bsSize="sm" 
                                            type="url" 
                                            value={link.url} 
                                            onChange={e => update(link.id, "url", e.target.value)} 
                                            placeholder="https://..." 
                                            className="flex-grow-1" 
                                        />
                                        <Button color="soft-danger" size="sm" onClick={() => remove(link.id)} disabled={isDeleting}>
                                            <i className="ri-delete-bin-line" />
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
            </div>

            <SaveButton onClick={saveAll} isSaving={isUpdating} />
        </div>
    );
};