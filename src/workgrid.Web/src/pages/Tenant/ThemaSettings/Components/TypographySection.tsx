import React from "react";
import { FormGroup, Label } from "reactstrap";
import { Field } from "formik";
import { Badge } from "reactstrap"; 
import { TenantConfig } from "common/data/TenantTypes";
import { SectionTitle, SubHead } from "./SectionTitle";

const FONT_OPTIONS = [
    { value: "'Inter', sans-serif",      label: "Inter" },
    { value: "'Roboto', sans-serif",     label: "Roboto" },
    { value: "'Open Sans', sans-serif",  label: "Open Sans" },
    { value: "'Poppins', sans-serif",    label: "Poppins" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "system-ui, sans-serif",   label: "Sistem" },
];

const BORDER_RADIUS_OPTIONS = [
    { label: "Keskin", value: "0px" },
    { label: "Hafif",  value: "4px" },
    { label: "Modern", value: "8px" },
    { label: "Soft",   value: "12px" },
    { label: "Oval",   value: "16px" },
];

interface TypographySectionProps {
    values: TenantConfig;
    set: (k: string, v: any) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({ values, set }) => (
    <div id="sec-tipografi" className="card mb-5">
        <div className="card-body">
            <SectionTitle
                icon="ri-text"
                title="Tipografi & Ergonomi"
                subtitle="Yazı tipi, boyut ve köşe yumuşatma"
            />

            <SubHead title="Yazı Tipi" />
            <div className="row g-2 mb-3">
                {FONT_OPTIONS.map(({ value, label }) => {
                    const active = values.fontFamily === value;
                    return (
                        <div className="col-6 col-sm-4 col-md-3" key={value}>
                            <button
                                type="button"
                                onClick={() => set("fontFamily", value)}
                                className={`w-100 btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`}
                                style={{ fontFamily: value }}
                            >
                                {active && <i className="ri-check-line me-1" />}{label}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="row g-3">
                <div className="col-sm-6 col-md-4">
                    <FormGroup className="mb-0">
                        <Label className="fs-12 fw-medium text-muted mb-1">Yazı Boyutu</Label>
                        <Field as="select" name="fontSize" className="form-select form-select-sm">
                            <option value="13px">13px — Kompakt</option>
                            <option value="14px">14px — Standart</option>
                            <option value="15px">15px — Orta</option>
                            <option value="16px">16px — Büyük</option>
                        </Field>
                    </FormGroup>
                </div>
                <div className="col-sm-6 col-md-8">
                    <Label className="fs-12 fw-medium text-muted mb-1 d-block">Köşe Yuvarlaklığı</Label>
                    <div className="d-flex flex-wrap gap-2">
                        {BORDER_RADIUS_OPTIONS.map(({ label, value }) => {
                            const active = values.borderRadius === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => set("borderRadius", value)}
                                    className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`}
                                >
                                    <span
                                        className={`d-inline-block border me-1 ${active ? "border-white" : "border-primary"}`}
                                        style={{ width: 14, height: 14, borderRadius: value, verticalAlign: "middle" }}
                                    />
                                    {label}
                                    <Badge
                                        color={active ? "light" : "primary"}
                                        className={`ms-1 fs-10 ${active ? "text-primary" : ""}`}
                                    >
                                        {value}
                                    </Badge>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
);