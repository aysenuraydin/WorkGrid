import React, { useState, useEffect } from "react";
import {
    Button, Card, CardBody, Row, Col, Input, Badge, Spinner,
} from "reactstrap";

import { ITestimonial } from "common/data/tenant";
import { useTestimonialsContext } from "context/TestimonialContext";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SectionHead } from "./SectionHead";
import { SaveButton } from "./SaveButton"; 
import useThemeMode from "hooks/useThemeMode";

export const TestimonialAdmin = () => {
    const { isDark } = useThemeMode(); 
    const {
        testimonials, isLoading, isError,
        createTestimonial, updateTestimonial, deleteTestimonial,
        isCreating, isUpdating, isDeleting,
    } = useTestimonialsContext();

    const [list, setList] = useState<ITestimonial[]>();

    useEffect(()=>{setList(testimonials)},[testimonials])

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;

    const getItem = (t: ITestimonial) => list?.find(x=>x.id == t.id) ?? t;

    const update = (id: string, field: keyof ITestimonial, value: any) => {
        setList(prev => prev?.map(t => 
            t.id === id ? { ...t, [field]: value, isDirty: true } : t
        ));
    };

    const add = () => {
        setList((prev) =>  [ 
            ...prev!,
            {id:Date.now().toString(), name: "Kullanıcı adı giriniz", role: "Role giriniz", comment: "Yorum giriniz", avatarUrl: "Görsel URL giriniz", rating: 1, isNew: true }
        ])
    };

    const remove = (id: string) => {
        setList(prev => prev?.map(t => 
            t.id === id ? { ...t, isDeleted: true, isDirty: true } : t
        ));
    };

const saveAll = async () => {
    for (const item of (list ?? []) as (ITestimonial & { isDeleted?: boolean; isNew?: boolean; isDirty?: boolean })[]) {
        if (item.isDeleted) {
            if (!item.isNew) await deleteTestimonial(item.id);
        } 
        else if (item.isNew) {
            await createTestimonial({ 
                id: item.id,
                name: item.name, 
                role: item.role, 
                comment: item.comment, 
                avatarUrl: item.avatarUrl, 
                rating: Number(item.rating) 
            });
        } 
        else if (item.isDirty) {
            await updateTestimonial(item.id, item);
        }
    }
};

    const StarRating = ({ id, rating }: { id: string; rating: number }) => (
        <div className="d-flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" className="btn btn-link p-0" onClick={() => update(id, "rating", star)}>
                    <i className={`${star <= rating ? "ri-star-fill text-warning" : "ri-star-line text-muted"} fs-16`} />
                </button>
            ))}
        </div>
    );

    return (
        <div>
            <SectionHead
                icon="ri-star-line"
                title="Müşteri yorumları"
                subtitle={`Toplam ${list?.length} yorum yönetiliyor`}
                action={
                    <Button color="primary" size="sm" onClick={add} disabled={isCreating}>
                        {isCreating ? <Spinner size="sm" /> : <><i className="ri-add-line me-1" />Yorum ekle</>}
                    </Button>
                }
            />

            <Row className="g-3">
                {list
                ?.slice()
                .filter((x:any)=>!x.isDeleted)
                ?.map((t:any) => {
                    const item = getItem(t);
                    return (
                        <Col lg={4} md={6} key={t.id}>
                            <Card className="mb-0 h-100 border">
                                <CardBody className="p-4">
                                    <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                                        <div className="avatar-sm rounded-circle d-flex align-items-center justify-content-center fs-16 fw-semibold flex-shrink-0" style={{ background: "#EEEDFE", color: "#534AB7" }}>
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1 min-width-0">
                                            <Input bsSize="sm" value={item.name} onChange={e => update(t.id, "name", e.target.value)} className="fw-semibold border-0 shadow-none p-0 fs-13 mb-1" />
                                            <Input bsSize="sm" value={item.role} onChange={e => update(t.id, "role", e.target.value)} className="text-muted border-0 shadow-none p-0 fs-11" />
                                        </div>
                                        <Button color="ghost-danger" size="sm" onClick={() => remove(t.id)} disabled={isDeleting} className="flex-shrink-0">
                                            <i className="ri-delete-bin-line"/>
                                        </Button>
                                    </div>

                                    <Input type="textarea" rows={4} value={item.comment} onChange={e => update(t.id, "comment", e.target.value)}  className={`bg-${isDark?"soft-":""}light border fs-13 mb-3`} />

                                    <div className="d-flex align-items-center justify-content-between">
                                        <StarRating id={t.id} rating={item.rating} />
                                        <Badge color="soft-warning" className="text-warning fs-11">{item.rating} / 5</Badge>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
            <SaveButton onClick={saveAll} isSaving={isLoading} />
        </div>
    );
};
