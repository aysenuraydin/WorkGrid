import React, { useState, useEffect } from "react";
import {
    Button, Card, CardBody, Row, Col, Input
} from "reactstrap";


import { IServiceSection } from "common/data/tenant";
import { IconPicker } from "components/Common/Iconpicker";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { useServicesContext } from "context/ServicesContext";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import { useTenantContext } from "context/TenantContext";


export const ServicesAdminPage = () => {
    const { config: tenantConfig} = useTenantContext();
    const { services: serverServices, isLoading, isError, saveServices, isSaving } = useServicesContext();
    const [services, setServices] = useState<IServiceSection | undefined>(undefined);

    useEffect(() => { if (serverServices) setServices(serverServices); }, [serverServices]);

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;
    if (!services) return null;

    const updateItem = (id: string, field: keyof IServiceSection["items"][0], value: string) =>
        setServices(prev => prev ? ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) }) : prev);

    const removeItem = (id: string) =>
        setServices(prev => prev ? ({ ...prev, items: prev.items.filter(item => item.id !== id) }) : prev);

    const addItem = () =>
        setServices(prev => prev ? ({
            ...prev,
            items: [...prev.items, { id: Date.now().toString(), icon: "ri-pencil-ruler-2-line", title: "Yeni Hizmet", description: "Açıklama girin..." }],
        }) : prev);

    return (
        <div>
            <SectionHead icon="ri-stack-line" title="Hizmet kartları" subtitle="Ana sayfada sunulan hizmetleri düzenleyin"
                action={<Button color="primary" size="sm" onClick={addItem}><i className="ri-add-line me-1" />Hizmet ekle</Button>}
            />

            <Card className="mb-3 border border-2">
                <CardBody className="p-3">
                    <Row className="g-3">
                        <Col md={6}>
                            <label className="fs-12 fw-medium text-muted mb-1 d-block text-uppercase" style={{ letterSpacing: "0.5px" }}>Bölüm Başlığı</label>
                            <Input value={services.mainTitle} onChange={e => setServices(prev => prev ? ({ ...prev, mainTitle: e.target.value }) : prev)} />
                        </Col>
                        <Col md={6}>
                            <label className="fs-12 fw-medium text-muted mb-1 d-block text-uppercase" style={{ letterSpacing: "0.5px" }}>Bölüm Açıklaması</label>
                            <Input value={services.mainDescription} onChange={e => setServices(prev => prev ? ({ ...prev, mainDescription: e.target.value }) : prev)} />
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Row className="g-3">
                {services.items.map(item => (
                    <Col lg={4} md={6} key={item.id}>
                        <Card className="mb-0 h-100 border border-2">
                            <CardBody className="p-4">
                                <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                                    <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center flex-shrink-0">
                                        <i className={`${item.icon} ${getContrastIconClass("var(--vz-primary)")} fs-20`}/>
                                    </div>
                                    <IconPicker
                                        value={item.icon}
                                        onChange={(ic) => updateItem(item.id, "icon", ic)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Başlık</label>
                                    <Input bsSize="sm" value={item.title} onChange={e => updateItem(item.id, "title", e.target.value)} className="fw-semibold" />
                                </div>
                                <div className="mb-3">
                                    <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Açıklama</label>
                                    <Input type="textarea" rows={3} value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} className="fs-13" />
                                </div>
                                <Button color="soft-danger" size="sm" className="w-100" onClick={() => removeItem(item.id)}>
                                    <i className="ri-delete-bin-line me-1" />Kaldır
                                </Button> 
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <SaveButton onClick={() => saveServices(services)} isSaving={isSaving} />
        </div>
    );
};
