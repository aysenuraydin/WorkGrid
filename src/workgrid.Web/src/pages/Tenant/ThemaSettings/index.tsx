import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import { Spinner } from "reactstrap";
import { useQueryClient } from "@tanstack/react-query";

import { TenantConfig } from "common/data/TenantTypes";
import { useTenantContext } from "context/TenantContext";
import { useDeleteFile } from "hooks/useFiles";


// Sections
import { ColorPaletteSection }  from "./Components/ColorPaletteSection";
import { SidebarTopbarSection } from "./Components/SidebarTopbarSection";
import { BackgroundSection }    from "./Components/BackgroundSection";
import { LogoFaviconSection }   from "./Components/LogoFaviconSection";
import { TypographySection }    from "./Components/TypographySection";
import { ModulesSection }       from "./Components/ModulesSection";
import { LayoutSection }        from "./Components/LayoutSection";
import { FormActionsBottom, FormActionsTop } from "./Components/FormActionsTop";
import { SidebarNav } from "./Components/SidebarNav";
import { SECTIONS } from "./Components/Constanst";

export const ThemaSettings: React.FC = () => {
    const { config: tenantConfig, isSaving, isLoading, update, save, reset, applyThemeToDom } =
        useTenantContext();

    const [activeSection, setActiveSection] = useState("sec-renkler");
    const [saveSuccess, setSaveSuccess]     = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([]);
    const { mutateAsync: deleteFileMutation } = useDeleteFile();

    // DOM'a tema uygula
    useEffect(() => { applyThemeToDom(); }, [tenantConfig, applyThemeToDom]);

    // Scroll spy
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const handler = () => {
            for (const { id } of [...SECTIONS].reverse()) {
                const el = container.querySelector(`#${id}`) as HTMLElement | null;
                if (el && el.getBoundingClientRect().top <= 160) {
                    setActiveSection(id);
                    break;
                }
            }
        };
        container.addEventListener("scroll", handler, { passive: true });
        return () => container.removeEventListener("scroll", handler);
    }, []);

    const scrollTo = (id: string) => {
        const container = scrollRef.current;
        const el = container?.querySelector(`#${id}`) as HTMLElement | null;
        if (el && container) container.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                <div className="text-center">
                    <Spinner color="primary" />
                    <p className="text-muted fs-13 mt-2 mb-0">Ayarlar yükleniyor…</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (
        values: TenantConfig,
        { setSubmitting }: { setSubmitting: (v: boolean) => void },
    ) => {
        try {
            if (selectedForDeletion.length > 0) {
                for (const url of selectedForDeletion) {
                    if (url?.trim()) {
                        try { await deleteFileMutation(url); }
                        catch (e) { console.warn(`Eski dosya silinemedi (${url}):`, e); }
                    }
                }
            }
            await save(values);
            update(values);
            setSelectedForDeletion([]);
            applyThemeToDom();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (e) {
            console.error("Kayıt hatası:", e);
        } finally {
            setSubmitting(false);
        }
    };

    const qc = useQueryClient();

    return (
        <Formik initialValues={tenantConfig} enableReinitialize onSubmit={handleSubmit}>
            {({ values, setFieldValue, handleReset, isSubmitting }: FormikProps<typeof tenantConfig>) => {
                const set = (k: string, v: any) => setFieldValue(k, v);

                const handleReset_ = () => {
                    reset();
                    handleReset();
                    setTimeout(() => applyThemeToDom(), 50);
                };

                const handleRevert = async () => {
                    await qc.invalidateQueries({ queryKey: ["tenantConfig"] });
                    handleReset();
                    applyThemeToDom();
                };

                return (
                    <Form>
                        <FormActionsTop
                            isSubmitting={isSubmitting}
                            isSaving={isSaving}
                            saveSuccess={saveSuccess}
                            onReset={handleReset_}
                        />

                        <style>{`
                            .no-scrollbar::-webkit-scrollbar { display: none; }
                            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                            /* sm & md: sidebar tam genişlik, içerik altında tam genişlik */
                            .thema-sidebar { width: 100%; }
                            @media (min-width: 992px) {
                                .thema-sidebar { width: auto; }
                            }
                        `}</style>

                        <div className="d-flex flex-column flex-lg-row gap-3 align-items-stretch align-items-lg-start">
                            <div className="thema-sidebar">
                                <SidebarNav activeSection={activeSection} onScrollTo={scrollTo} />
                            </div>

                            <div
                                ref={scrollRef}
                                className="flex-grow-1 no-scrollbar w-100"
                                style={{
                                    overflowY: "auto",
                                    paddingRight: 4,
                                }}
                            >
                                <div className="d-flex flex-column gap-3">
                                    <ColorPaletteSection  values={values} set={set} />
                                    <SidebarTopbarSection values={values} set={set} />
                                    <BackgroundSection    values={values} set={set} tenantConfig={tenantConfig} />
                                    <LogoFaviconSection
                                        values={values}
                                        set={set}
                                        onMarkForDeletion={(url) =>
                                            setSelectedForDeletion((prev) => [...prev, url])
                                        }
                                    />
                                    <TypographySection values={values} set={set} />
                                    <ModulesSection    values={values} set={set} />
                                    <LayoutSection     values={values} set={set} />
                                </div>

                                <div style={{ height: 32 }} />
                            </div>
                        </div>

                        <FormActionsBottom
                            isSubmitting={isSubmitting}
                            isSaving={isSaving}
                            onReset={handleReset_}
                            onRevert={handleRevert}
                        />
                    </Form>
                );
            }}
        </Formik>
    );
};