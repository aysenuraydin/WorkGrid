import React from "react";
import { Card, CardBody, Row, Col, Input, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import { IBrandConfig, IContactConfig } from "common/data/tenant";
import { useContactContext } from "context/ContactContext";
import { useBrandContext } from "context/BrandContext";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import { useTenantContext } from "context/TenantContext";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import useThemeMode from "hooks/useThemeMode";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-3">
        <label className="fs-12 fw-medium text-muted text-uppercase mb-1 d-block" style={{ letterSpacing: "0.5px" }}>
            {label}
        </label>
        {children}
    </div>
);

const contactValidation = Yup.object({
    address1:     Yup.string(),
    address2:     Yup.string(),
    workingHours: Yup.string(),
    email:        Yup.string().email("Geçerli bir e-posta giriniz"),
    phone:        Yup.string(),
});

const brandValidation = Yup.object({
    companyName: Yup.string(),
    website:     Yup.string(),
    description: Yup.string(),
});

export const BrandingAdmin = () => {
    const { isDark } = useThemeMode(); 
    const { brand: serverBrand, isLoading: brandLoading, isError: brandError, saveBrand, isSaving: savingBrand } = useBrandContext();
    const { contact: serverContact, isLoading: contactLoading, isError: contactError, saveContact, isSaving: savingContact } = useContactContext(); 
    
    const inputClasses = `border-0 ${isDark ? "bg-dark text-light" : "bg-light text-dark"}`;

    // ── Marka formu ──
    const brandFormik = useFormik<IBrandConfig>({
        enableReinitialize: true,
        initialValues: {
            ...serverBrand,     
            companyName: serverBrand?.companyName ?? "",
            website:     serverBrand?.website     ?? "",
            description: serverBrand?.description  ?? "",
        } as IBrandConfig,
        validationSchema: brandValidation,
        onSubmit: (values) => {
            saveBrand(values);
        },
    });

    // ── İletişim formu ──
    const contactFormik = useFormik<IContactConfig>({
        enableReinitialize: true,
        initialValues: {
            address1:     serverContact?.address1     ?? "",
            address2:     serverContact?.address2     ?? "",
            workingHours: serverContact?.workingHours ?? "",
            email:        serverContact?.email        ?? "",
            phone:        serverContact?.phone        ?? "",
        },
        validationSchema: contactValidation,
        onSubmit: (values) => {
            saveContact(values);
        },
    });

    if (brandLoading || contactLoading) return <LoadingState />;
    if (brandError || contactError)     return <ErrorState />;
    if (!serverBrand || !serverContact) return null;

    const isSaving = savingBrand || savingContact;

    // ── Tek tıkla ikisini de submit et ──
    const handleSave = () => {
        brandFormik.submitForm();
        contactFormik.submitForm();
    };

    return (
        <div>
            <SectionHead icon="ri-building-4-line" title="Marka ve kurumsal kimlik" subtitle="Şirket bilgileri ve iletişim detayları" />

            <Row className="g-3">
                {/* MARKA KİMLİĞİ — artık formik */}
                <Col lg={5}>
                    <Card className="mb-0 h-100 border border-2">
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                                <div className="avatar-xs bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                                    <i className={`${getContrastIconClass("var(--vz-primary)")} ri-building-line`} />
                                </div>
                                <h6 className="mb-0 fs-13 fw-semibold">Marka Kimliği</h6>
                            </div>
                            <Field label="Şirket Adı">
                                <Input
                                    name="companyName"
                                    value={brandFormik.values.companyName || ""}
                                    onChange={brandFormik.handleChange}
                                    onBlur={brandFormik.handleBlur}
                                    className={inputClasses}
                                />
                            </Field>
                            <Field label="Web Sitesi">
                                <Input
                                    name="website"
                                    type="url"
                                    value={brandFormik.values.website || ""}
                                    onChange={brandFormik.handleChange}
                                    onBlur={brandFormik.handleBlur}
                                    className={inputClasses}
                                />
                            </Field>
                            <Field label="Açıklama">
                                <Input
                                    name="description"
                                    value={brandFormik.values.description || ""}
                                    onChange={brandFormik.handleChange}
                                    onBlur={brandFormik.handleBlur}
                                    type="textarea"
                                    rows="5"
                                    className={inputClasses}
                                />
                            </Field>
                        </CardBody>
                    </Card>
                </Col>

                {/* İLETİŞİM BİLGİLERİ — değişmedi */}
                <Col lg={7}>
                    <Card className="mb-0 h-100 border border-2">
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                                <div className="avatar-xs bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                                    <i className={`${getContrastIconClass("var(--vz-primary)")} ri-map-pin-line`} />
                                </div>
                                <h6 className="mb-0 fs-13 fw-semibold">İletişim Bilgileri</h6>
                            </div>

                            <Row className="g-3">
                                <Col md={6}>
                                    <Field label="Adres (Satır 1)">
                                        <Input name="address1" value={contactFormik.values.address1}
                                            onChange={contactFormik.handleChange} onBlur={contactFormik.handleBlur}
                                            className={inputClasses} />
                                    </Field>
                                </Col>
                                <Col md={6}>
                                    <Field label="Adres (Satır 2)">
                                        <Input name="address2" value={contactFormik.values.address2}
                                            onChange={contactFormik.handleChange} onBlur={contactFormik.handleBlur}
                                            className={inputClasses} />
                                    </Field>
                                </Col>
                                <Col md={12}>
                                    <Field label="Çalışma Saatleri">
                                        <Input name="workingHours" value={contactFormik.values.workingHours}
                                            onChange={contactFormik.handleChange} onBlur={contactFormik.handleBlur}
                                            className={inputClasses} />
                                    </Field>
                                </Col>
                                <Col md={6}>
                                    <Field label="E-posta">
                                        <Input type="email" name="email" value={contactFormik.values.email}
                                            onChange={contactFormik.handleChange} onBlur={contactFormik.handleBlur}
                                            invalid={!!(contactFormik.touched.email && contactFormik.errors.email)}
                                            className={inputClasses} />
                                        {contactFormik.touched.email && contactFormik.errors.email && (
                                            <FormFeedback>{contactFormik.errors.email}</FormFeedback>
                                        )}
                                    </Field>
                                </Col>
                                <Col md={6}>
                                    <Field label="Telefon">
                                        <Input name="phone" value={contactFormik.values.phone}
                                            onChange={contactFormik.handleChange} onBlur={contactFormik.handleBlur}
                                            className={inputClasses} />
                                    </Field>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <SaveButton onClick={handleSave} isSaving={isSaving} />
        </div>
    );
};