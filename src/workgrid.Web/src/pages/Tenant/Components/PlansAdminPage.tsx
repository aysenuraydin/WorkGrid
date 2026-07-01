import React, { useState, useEffect } from "react";
import {
    Button, Card, CardBody, Row, Col, Input, Badge, 
} from "reactstrap";


import {IPlanSection } from "common/data/tenant";
import { IconPicker } from "components/Common/Iconpicker";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { usePlansContext } from "context/PlansContext";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import { useTenantContext } from "context/TenantContext";


export const PlansAdminPage = () => {
    const { config: tenantConfig} = useTenantContext();
    const { plans: serverPlans, isLoading, isError, savePlans, isSaving } = usePlansContext();
    const [plans, setPlans] = useState<IPlanSection | undefined>(undefined);

    useEffect(() => {
        if (serverPlans) setPlans(serverPlans);
    }, [serverPlans]);

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;
    if (!plans)    return null;

    const updateField = (pI: number, field: string, value: any) => {
        setPlans(prev => prev && ({
            ...prev,
            items: prev.items.map((p, i) => i === pI ? { ...p, [field]: value } : p),
        }));
    };

    const updateFeatText = (pI: number, fI: number, text: string) => {
        setPlans(prev => {
            if (!prev) return prev;
            const items = prev.items.map((p, i) =>
                i === pI
                    ? { ...p, features: p.features.map((f, j) => j === fI ? { ...f, text } : f) }
                    : p
            );
            return { ...prev, items };
        });
    };

    const toggleFeat = (pI: number, fI: number) => {
        setPlans(prev => {
            if (!prev) return prev;
            const items = prev.items.map((p, i) =>
                i === pI
                    ? { ...p, features: p.features.map((f, j) => j === fI ? { ...f, isIncluded: !f.isIncluded } : f) }
                    : p
            );
            return { ...prev, items };
        });
    };

    const removeFeat = (pI: number, fI: number) => {
        setPlans(prev => {
            if (!prev) return prev;
            const items = prev.items.map((p, i) =>
                i === pI
                    ? { ...p, features: p.features.filter((_, j) => j !== fI) }
                    : p
            );
            return { ...prev, items };
        });
    };

    const addFeat = (pI: number) => {
        setPlans(prev => {
            if (!prev) return prev;
            const items = prev.items.map((p, i) =>
                i === pI
                    ? { ...p, features: [...p.features, { text: "Yeni özellik", isIncluded: true }] }
                    : p
            );
            return { ...prev, items };
        });
    };

    const addPlan = () => {
        setPlans(prev => prev && ({
            ...prev,
            items: [...prev.items, {
                id: Date.now().toString(),
                name: "Yeni Plan",
                subTitle: "Açıklama",
                icon: "ri-book-mark-line",
                priceMonthly: 0,
                priceAnnual: 0,
                isPopular: false,
                features: [],
            }],
        }));
    };

    const removePlan = (pI: number) => {
        setPlans(prev => prev && ({ ...prev, items: prev.items.filter((_, i) => i !== pI) }));
    };

    return (
        <div>
            <SectionHead
                icon="ri-price-tag-3-line"
                title="Fiyatlandırma planları"
                subtitle="Plan içerik ve fiyatlarını buradan düzenleyin"
                action={
                    <Button color="primary" size="sm" onClick={addPlan}>
                        <i className="ri-add-line me-1" />Plan ekle
                    </Button>
                }
            />

            <Row className="g-3">
                {plans.items.map((plan, pI) => (
                    <Col lg={4} key={plan.id}>
                        <Card className={`h-100 mb-0 border ${plan.isPopular ? "border-primary border-2" : ""}`}>
                            {plan.isPopular && (
                                <div className="text-center">
                                    <Badge
                                        color="primary"
                                        className="position-relative"
                                        style={{ top: -1, borderRadius: "0 0 6px 6px", fontSize: 11 }}
                                    >
                                        En Popüler
                                    </Badge>
                                </div>
                            )}

                            <CardBody className="p-4">
                                {/* ÜSTÜ: İkon + Başlık + Popüler toggle */}
                                <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                                    {/* Seçilen ikonun önizlemesi */}
                                    <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center flex-shrink-0">
                                        <i className={`${plan.icon} ${getContrastIconClass("var(--vz-primary)")} fs-20`}/>
                                    </div>

                                    <div className="flex-grow-1">
                                        <div className="mb-2">
                                            <IconPicker
                                                value={plan.icon}
                                                onChange={(ic) => updateField(pI, "icon", ic)}
                                            />
                                        </div>

                                        <Input
                                            bsSize="sm"
                                            value={plan.name}
                                            onChange={(e) => updateField(pI, "name", e.target.value)}
                                            className="fw-semibold mb-1 border-0 shadow-none p-0 fs-14"
                                        />
                                        <Input
                                            bsSize="sm"
                                            value={plan.subTitle}
                                            onChange={(e) => updateField(pI, "subTitle", e.target.value)}
                                            className="text-muted border-0 shadow-none p-0 fs-12"
                                        />
                                    </div>

                                    <div className="form-check form-switch mb-0" title="Popüler olarak işaretle">
                                        <Input
                                            type="checkbox"
                                            role="switch"
                                            checked={plan.isPopular}
                                            onChange={(e) => updateField(pI, "isPopular", e.target.checked)}
                                            id={`pop-${plan.id}`}
                                        />
                                    </div>
                                </div>

                                {/* FİYAT BÖLÜMÜ */}
                                <div className="d-flex gap-3 mb-3 pb-3 border-bottom">
                                    <div className="flex-grow-1">
                                        <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">
                                            Aylık ($)
                                        </label>
                                        <Input
                                            type="number"
                                            value={plan.priceMonthly}
                                            onChange={(e) => updateField(pI, "priceMonthly", Number(e.target.value))}
                                            className="fs-20 fw-bold border-0 shadow-none p-0 bg-transparent"
                                        />
                                    </div>
                                    <div className="vr" />
                                    <div className="flex-grow-1">
                                        <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">
                                            Yıllık ($)
                                        </label>
                                        <Input
                                            type="number"
                                            value={plan.priceAnnual}
                                            onChange={(e) => updateField(pI, "priceAnnual", Number(e.target.value))}
                                            className="fs-20 fw-bold border-0 shadow-none p-0 bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* ÖZELLİKLER */}
                                <ul className="list-unstyled vstack gap-2 mb-3">
                                    {plan.features.map((feat, fI) => (
                                        <li key={fI} className="d-flex align-items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleFeat(pI, fI)}
                                                className="btn btn-link p-0 flex-shrink-0"
                                                title={feat.isIncluded ? "Dahil" : "Hariç"}
                                            >
                                                <i className={`fs-16 ${feat.isIncluded ? "ri-checkbox-circle-fill text-success" : "ri-close-circle-fill text-danger"}`} />
                                            </button>
                                            <Input
                                                bsSize="sm"
                                                value={feat.text}
                                                onChange={(e) => updateFeatText(pI, fI, e.target.value)}
                                                className={`border-0 shadow-none p-0 flex-grow-1 fs-13 ${feat.isIncluded ? "" : "text-muted text-decoration-line-through"}`}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-link p-0 text-danger flex-shrink-0"
                                                onClick={() => removeFeat(pI, fI)}
                                            >
                                                <i className="ri-delete-bin-line fs-14" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="d-flex gap-2">
                                    <Button color="soft-primary" size="sm" className="flex-grow-1" onClick={() => addFeat(pI)}>
                                        <i className="ri-add-line me-1" />Özellik ekle
                                    </Button>
                                    <Button color="soft-danger" size="sm" onClick={() => removePlan(pI)}>
                                        <i className="ri-delete-bin-line" />
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <SaveButton onClick={() => savePlans(plans)} isSaving={isSaving} />
        </div>
    );
};