import React from "react";
import { Input, Badge } from "reactstrap";
import { Field } from "formik"; 
import { TenantConfig } from "common/data/TenantTypes";
import { SectionTitle } from "./SectionTitle";
import { FEATURE_TOGGLES, MAIN_VIEW_OPTIONS } from "./Constanst";
import useThemeMode from "hooks/useThemeMode";

interface ModulesSectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({ values, set }) => {
  const { isDark } = useThemeMode(); 
    return(
    <div id="sec-moduller" className="card mb-5">
        <div className="card-body">
            <SectionTitle
                icon="ri-apps-line"
                title="Modül Şalterleri"
                subtitle="Aktif modüller sol menüde görünür"
            />

            {/* Feature toggles */}
            <div className="row g-2 mb-4 pb-5">
                {FEATURE_TOGGLES.map(({ key, label, description, icon }) => {
                    const isOn = !!(values as any)[key];
                    return (
                        <div className="col-12 col-sm-6" key={key}>
                            <div
                                className={`border rounded p-3 d-flex align-items-start gap-3 ${isOn ? "border-primary" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => set(key, !isOn)}
                            >
                                <i className={`${icon} fs-20 mt-1 ${isOn ? "text-primary" : "text-muted"}`} />
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <span className="fw-medium fs-13">{label}</span>
                                        <div className="form-check form-switch mb-0">
                                            <Input
                                                type="checkbox"
                                                role="switch"
                                                className={`form-check-input ${isOn ? "bg-primary border-primary" : ""}`}
                                                checked={isOn}
                                                onChange={(e) => set(key, e.target.checked)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-muted fs-11 mb-0 mt-1">{description}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main view selector */}
            <SectionTitle
                icon="ri-home-4-line"
                title="Varsayılan Giriş Sayfası"
                subtitle="Login sonrası açılacak ilk ekran — hazır seçenek veya özel route"
            />

            <div className="row g-2 mb-3 mt-4">
                {MAIN_VIEW_OPTIONS.map(({ value, label, icon }) => {
                    const active = values.mainView === value;
                    if (value === "calendar"    && !values.showCalendar) return null;
                    if (value === "toDoList"    && !values.showTask)     return null;
                    if (value === "kanbanboard" && !values.showKanban)   return null;
                    return (
                        <div className="col-6 col-sm-3" key={value}>
                            <button
                                type="button"
                                onClick={() => set("mainView", value)}
                                className={`w-100 btn d-flex flex-column align-items-center py-3 gap-2 ${
                                    active ? "btn-primary" : "btn-outline-primary"
                                }`}
                            >
                                <i className={`${icon} fs-24`} />
                                <span className="fs-12">{label}</span>
                                {active && <Badge color="light" className="text-primary fs-10">Seçili</Badge>}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Custom route input */}
            <div className={`border rounded p-3 bg-${isDark?"soft-":""}light`}>
                <label
                    className="fs-12 fw-medium text-muted text-uppercase mb-1 d-block"
                    style={{ letterSpacing: "0.5px" }}
                >
                    <i className="ri-route-line me-1" />Özel Rota (opsiyonel)
                </label>
                <div className="input-group input-group-sm">
                    <span className="input-group-text font-monospace text-muted">/</span>
                    <Field
                        name="mainView"
                        className="form-control form-control-sm font-monospace"
                        placeholder="örn: crm/leads  veya  dashboard/analytics"
                    />
                    {!MAIN_VIEW_OPTIONS.some((o) => o.value === values.mainView) && values.mainView && (
                        <span className="input-group-text text-success">
                            <i className="ri-check-line" />
                        </span>
                    )}
                </div>
                <small className="text-muted fs-11 mt-1 d-block">
                    Yukarıdan hazır seçim yapınca burası da güncellenir. Kendin yazarsan hazır butonlar pasif kalır.
                </small>
            </div>
        </div>
    </div>
)
};