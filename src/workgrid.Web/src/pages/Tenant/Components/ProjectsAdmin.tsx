import React, { useState, useEffect } from "react";
import {
    Button, Card, CardBody, Row, Col, Input
} from "reactstrap";


import { IProject } from "common/data/tenant";
import { useWorksContext } from "context/WorksContext";
import { SaveButton } from "./SaveButton";
import { SectionHead } from "./SectionHead";

export const ProjectsAdmin = () => {
    const { works, isLoading, isError, createWork, updateWork, deleteWork } = useWorksContext();
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        if (works) setList(works);
    }, [works]);

    const update = (id: string, field: keyof IProject, value: any) => {
        setList(prev => prev.map(p => 
            p.id === id ? { ...p, [field]: value, isDirty: true } : p
        ));
    };

    const add = () => {
        setList(prev => [...prev, { 
            id: Date.now().toString(), 
            title: "Yeni Proje", 
            category: "Web", 
            imageUrl: "", 
            clientName: "", 
            link: "",
            isNew: true,
            isDirty: true 
        }]);
    };

    const remove = (id: string) => {
        setList(prev => prev.map(p => 
            p.id === id ? { ...p, isDeleted: true, isDirty: true } : p
        ));
    };

    const saveAll = async () => {
        for (const item of list) {
            if (item.isDeleted) {
                if (!item.isNew) await deleteWork(item.id);
            } else if (item.isNew) {
                await createWork({ 
                    id:item.id,
                    title: item.title, 
                    category: item.category, 
                    imageUrl: item.imageUrl, 
                    clientName: item.clientName, 
                    link: item.link 
                });
            } else if (item.isDirty) {
                await updateWork(item.id, item);
            }
        }
        // İsteğe bağlı: İşlem bitince veriyi tazele
        // qc.invalidateQueries(['works']); 
    };

    if (isLoading) return <div>Yükleniyor...</div>;
    if (isError) return <div>Hata oluştu!</div>;

    return (
        <div>
            <SectionHead
                icon="ri-briefcase-line"
                title="Portfolyo projeleri"
                subtitle={`${list.filter(x => !x.isDeleted).length} proje yönetiliyor`}
                action={
                    <Button color="primary" size="sm" onClick={add}>
                        <i className="ri-add-line me-1" />Proje ekle
                    </Button>
                }
            /> 

            <Row className="g-3">
                {list.filter(p => !p.isDeleted).map((p: any) => (
                    <Col lg={4} md={6} key={p.id}>
                        <Card className="mb-0 h-100 border">
                            <div className="bg-light border-bottom text-center" style={{ height: 140 }}>
                                {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.title} style={{ maxHeight: 140, width: "100%", objectFit: "cover" }} />
                                ) : (
                                    <div className="p-4 text-muted">
                                        <i className="ri-image-add-line fs-32" />
                                        <p className="fs-12">Görsel URL girin</p>
                                    </div>
                                )}
                            </div>

                            <CardBody className="p-4">
                                <div className="mb-3">
                                    <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Proje Adı</label>
                                    <Input value={p.title || ""} onChange={e => update(p.id, "title", e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Görsel URL</label>
                                    <Input type="url" value={p.imageUrl || ""} onChange={e => update(p.id, "imageUrl", e.target.value)} placeholder="https://..." />
                                </div>
                                <Row className="g-2 mb-3">
                                    <Col xs={6}>
                                        <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Kategori</label>
                                        <Input bsSize="sm" value={p.category || ""} onChange={e => update(p.id, "category", e.target.value)} />
                                    </Col>
                                    <Col xs={6}>
                                        <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Müşteri</label>
                                        <Input bsSize="sm" value={p.clientName || ""} onChange={e => update(p.id, "clientName", e.target.value)} />
                                    </Col>
                                </Row>
                                <div className="mb-3">
                                    <label className="fs-11 text-muted text-uppercase fw-medium d-block mb-1">Proje Linki</label>
                                    <Input bsSize="sm" type="url" value={p.link || ""} onChange={e => update(p.id, "link", e.target.value)} placeholder="https://..." />
                                </div>

                                <div className="text-end">
                                    <Button color="soft-danger" size="sm" onClick={() => remove(p.id)}>
                                        <i className="ri-delete-bin-line" /> Kaldır
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            <SaveButton onClick={saveAll} isSaving={isLoading} />
        </div>
    );
};