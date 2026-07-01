import React from "react";
import { Card, CardBody, Row, Col, Input, FormGroup, Label, FormFeedback } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import { useTenantContext } from "context/TenantContext";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import { ICommerceConfig } from "common/data/ICommerceConfig";
import { useGetCommerce, useUpdateCommerce } from "hooks/useCommerce";
import useThemeMode from "hooks/useThemeMode";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mb-3">
        <label className="fs-12 fw-medium text-muted text-uppercase mb-1 d-block" style={{ letterSpacing: "0.5px" }}>
            {label}
        </label>
        {children}
    </div>
);

const commerceValidation = Yup.object({
    currencyCode:       Yup.string().required("Para birimi gereklidir"),
    invoiceNotes:       Yup.string(),
    defaultShippingFee: Yup.number().min(0, "Ücret negatif olamaz"),
});

export const CommerceAdmin = () => { 
    const { isDark } = useThemeMode(); 
    const { data: commerce, isLoading, isError } = useGetCommerce();
    const { mutate: saveCommerce, isPending: isSaving } = useUpdateCommerce(); 

    const formik = useFormik<ICommerceConfig>({
        enableReinitialize: true,
        initialValues: {
            currencyCode:       commerce?.currencyCode       ?? "₺",
            invoiceNotes:       commerce?.invoiceNotes       ?? "",
            defaultShippingFee: commerce?.defaultShippingFee ?? 0, 
        },
        validationSchema: commerceValidation,
        onSubmit: (values) => {
            saveCommerce(values);
        },
    });

    if (isLoading) return <LoadingState />;
    if (isError || !commerce) return <ErrorState />;

    return (
        <div>
            <SectionHead 
                icon="ri-money-dollar-circle-line" 
                title="Ticari Ayarlar" 
                subtitle="Para birimi, fatura notları ve kargo yapılandırması" 
            />

            <Row className="g-3">
                <Col lg={7}>
                    <Card className="mb-0 h-100 border border-2">
                        <CardBody className="p-4">
                            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
                                <div className="avatar-xs bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                                    <i className={`${getContrastIconClass("var(--vz-primary)")} ri-settings-3-line`} />
                                </div>
                                <h6 className="mb-0 fs-13 fw-semibold">Ticari Yapılandırma</h6>
                            </div>

                            <Row className="g-3">
                                <Col md={6}>
                                    <Field label="Para Birimi">
                                        <Input
                                            name="currencyCode"
                                            value={formik.values.currencyCode}
                                            onChange={formik.handleChange}
                                            className={`bg-${isDark?"soft-":""}light border`}
                                        />
                                    </Field>
                                </Col>
                                <Col md={6}>
                                    <Field label="Varsayılan Kargo Ücreti">
                                        <Input
                                            name="defaultShippingFee"
                                            type="number"
                                            value={formik.values.defaultShippingFee}
                                            onChange={formik.handleChange}
                                            className={`bg-${isDark?"soft-":""}light border`}
                                        />
                                    </Field>
                                </Col>
                                <Col md={12}>
                                    <Field label="Fatura Notları">
                                        <Input
                                            name="invoiceNotes"
                                            type="textarea"
                                            rows="4"
                                            value={formik.values.invoiceNotes}
                                            onChange={formik.handleChange}
                                            className={`bg-${isDark?"soft-":""}light border`}
                                        />
                                    </Field>
                                </Col> 
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <SaveButton onClick={formik.submitForm} isSaving={isSaving} />
        </div>
    );
};