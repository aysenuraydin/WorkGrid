import React, { useState, useEffect } from "react";
import {
    Button, Card, CardBody, Input, Row, Col
} from "reactstrap";

import { IClientItem, useClientItemsContext } from "context/ClientItemsContext";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton";
import useThemeMode from "hooks/useThemeMode";

export const ClientItemsAdmin = () => {
    const { isDark } = useThemeMode(); 
    const { 
        clients, 
        isLoading, 
        isError, 
        createClient, 
        updateClient, 
        deleteClient, 
        isCreating, 
        isUpdating, 
        isDeleting 
    } = useClientItemsContext();
    
    const [localClients, setLocalClients] = useState<(IClientItem & { isNew?: boolean; isDirty?: boolean; isDeleted?: boolean })[]>([]);

    useEffect(() => { 
        if (clients) {
            setLocalClients(clients); 
        }
    }, [clients]);

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;

    const add = () =>
        setLocalClients(prev => [...prev, { id: `temp-${Date.now()}`, name: "", logoUrl: "", isNew: true }]);

    const remove = (id: string | number) => {
        setLocalClients(prev => prev.map(c => 
            c.id === id ? { ...c, isDeleted: true, isDirty: true } : c
        ));
    };

    const update = (id: string | number, field: keyof IClientItem, value: any) => {
        setLocalClients(prev => prev.map(c => {
            if (c.id !== id) return c;
            return { ...c, [field]: value, isDirty: true };
        }));
    };

    const saveAll = async () => {
        for (const client of localClients) {
            const payload = {
                name: client.name,
                logoUrl: client.logoUrl
            };
            
            if (client.isDeleted) {
                if (!client.isNew && client.id) {
                    await deleteClient(client.id);
                }
            } 
            else if (client.isNew) {
                await createClient(payload as any);
            } 
            else if (client.isDirty && client.id) {
                await updateClient(client.id, payload);
            }
        }
    };

    const activeClients = localClients.filter(c => !c.isDeleted);
    const isSaving = isCreating || isUpdating || isDeleting;

    return (
        <div>
            <SectionHead
                icon="ri-shield-star-line"
                title="Referans Markalar"
                subtitle={`Landing sayfasında listelenen güvenilir şirket logoları (Toplam ${activeClients.length} marka)`}
                action={<Button color="primary" size="sm" onClick={add}><i className="ri-add-line me-1" />Ekle</Button>}
            />

            <div className="vstack gap-2">
                {activeClients.length === 0 ? (
                    <Card className="border border-dashed text-center py-4 text-muted">
                        <CardBody>
                            <i className="ri-image-add-line fs-24 d-block mb-2 text-muted"></i>
                            Henüz referans marka eklenmemiş.
                        </CardBody>
                    </Card>
                ) : (
                    activeClients.map(client => {
                        return (
                            <Card key={client.id} className="mb-0 border border-2">
                                <CardBody className="p-3">
                                    <Row className="g-2 align-items-center">
                                        
                                        <Col xs="auto">
                                            <div className="bg-light rounded d-flex align-items-center justify-content-center border" style={{ width: "60px", height: "40px", overflow: "hidden" }}>
                                                {client.logoUrl ? (
                                                    <img 
                                                        src={client.logoUrl} 
                                                        alt="Logo Önizleme" 
                                                        className="img-fluid" 
                                                        style={{ maxHeight: "30px", objectFit: "contain" }} 
                                                        onError={(e) => {
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <i className="ri-image-line fs-18 text-muted" />
                                                )}
                                            </div>
                                        </Col>

                                        <Col md={3} xs={12}>
                                            <Input 
                                                bsSize="sm" 
                                                type="text" 
                                                value={client.name} 
                                                onChange={e => client.id && update(client.id, "name", e.target.value)} 
                                                placeholder="Şirket Adı"  
                                                className={`bg-${isDark?"soft-":""}light border `}
                                            />
                                        </Col>

                                        <Col className="flex-grow-1">
                                            <Input 
                                                bsSize="sm" 
                                                type="url" 
                                                value={client.logoUrl} 
                                                onChange={e => client.id && update(client.id, "logoUrl", e.target.value)} 
                                                placeholder="Logo URL'i (https://... veya resim-adi.png)" 
                                                className={`bg-${isDark?"soft-":""}light border `}
                                            />
                                        </Col>

                                        <Col xs="auto">
                                            <Button color="soft-danger" size="sm" onClick={() => client.id && remove(client.id)} disabled={isSaving}>
                                                <i className="ri-delete-bin-line" />
                                            </Button>
                                        </Col>

                                    </Row>
                                </CardBody>
                            </Card>
                        );
                    })
                )}
            </div>

            <SaveButton onClick={saveAll} isSaving={isSaving} />
        </div>
    );
};