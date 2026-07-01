import React, { useState, useEffect } from "react";
import {
    Button, Card, Row, Col, Input
} from "reactstrap";


import {
    IFAQCategory,
} from "common/data/tenant";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { useFaqContext } from "context/FaqContext";
import { SaveButton } from "./SaveButton";
import { SectionHead } from "./SectionHead";
import { getContrastIconClass } from "common/utils/getContrastIconClass";
import { useTenantContext } from "context/TenantContext";
import useThemeMode from "hooks/useThemeMode";


export const FaqAdminPage = () => {
    const { isDark } = useThemeMode();
    const { faqs: serverFaqs, isLoading, isError, saveFaqs, isSaving } = useFaqContext();
    const [faqs, setFaqs] = useState<IFAQCategory[]>([]);
    const { config: tenantConfig} = useTenantContext(); 

    useEffect(() => { if (serverFaqs.length) setFaqs(serverFaqs); }, [serverFaqs]);

    if (isLoading) return <LoadingState />;
    if (isError)   return <ErrorState />;

    const addCategory = () =>
        setFaqs(prev => [...prev, { category: "Yeni Kategori", icon: "ri-question-line", questions: [] }]);

    const removeCategory = (cI: number) =>
        setFaqs(prev => prev.filter((_, i) => i !== cI));

    const updateCategory = (cI: number, field: keyof IFAQCategory, value: any) =>
        setFaqs(prev => prev.map((c, i) => i === cI ? { ...c, [field]: value } : c));

    const addQuestion = (cI: number) =>
        setFaqs(prev => prev.map((c, i) => i === cI
            ? { ...c, questions: [...c.questions, { q: "Yeni soru?", a: "Cevap girin..." }] }
            : c
        ));

    const removeQuestion = (cI: number, qI: number) =>
        setFaqs(prev => prev.map((c, i) => i === cI
            ? { ...c, questions: c.questions.filter((_, j) => j !== qI) }
            : c
        ));

    const updateQuestion = (cI: number, qI: number, field: "q" | "a", value: string) =>
        setFaqs(prev => prev.map((c, i) => i === cI
            ? { ...c, questions: c.questions.map((q, j) => j === qI ? { ...q, [field]: value } : q) }
            : c
        ));

    return (
        <div>
            <SectionHead
                icon="ri-question-answer-line"
                title="Sıkça sorulan sorular"
                subtitle="Kategori ve soru içeriklerini yönetin"
                action={<Button color="primary" size="sm" onClick={addCategory}><i className="ri-add-line me-1" />Kategori ekle</Button>}
            />

            <div className="vstack gap-3">
                {faqs.map((cat, cI) => (
                    <Card key={cI} className="mb-0 overflow-hidden">
                        <div className={`p-3 bg-${isDark?"soft-":""}light border-bottom d-flex align-items-center gap-3`}>
                            <div className="avatar-xs bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center flex-shrink-0">
                                <i className={`${cat.icon} ${getContrastIconClass("var(--vz-primary)")} fs-20`}/>
                            </div>
                            <Input bsSize="sm" value={cat.category} onChange={e => updateCategory(cI, "category", e.target.value)} className="fw-semibold border-0 shadow-none bg-transparent p-0 fs-14 flex-grow-1" />
                            <Button color="soft-primary" size="sm" onClick={() => addQuestion(cI)}><i className="ri-add-circle-line me-1" />Soru ekle</Button>
                            <Button color="soft-danger" size="sm" onClick={() => removeCategory(cI)}><i className="ri-delete-bin-line" /></Button>
                        </div>

                        {cat.questions.length > 0 && (
                            <div className="px-3 pt-2 pb-1">
                                <Row className="g-0">
                                    <Col xs={5}><span className="fs-11 text-uppercase fw-semibold text-muted">Soru</span></Col>
                                    <Col xs={6}><span className="fs-11 text-uppercase fw-semibold text-muted">Cevap</span></Col>
                                </Row>
                            </div>
                        )}

                        {cat.questions.map((item, qI) => (
                            <div key={qI} className="px-3 py-2 border-top d-flex align-items-start gap-2">
                                <Row className="g-2 flex-grow-1">
                                    <Col xs={5}><Input bsSize="sm" value={item.q} onChange={e => updateQuestion(cI, qI, "q", e.target.value)} className="shadow-none border bg-transparent fs-13" /></Col>
                                    <Col xs={7}><Input bsSize="sm" value={item.a} onChange={e => updateQuestion(cI, qI, "a", e.target.value)} className="shadow-none border bg-transparent text-muted fs-13" /></Col>
                                </Row>
                                <Button color="ghost-danger" size="sm" onClick={() => removeQuestion(cI, qI)} className="flex-shrink-0">
                                    <i className="ri-delete-bin-line" />
                                </Button>
                            </div>
                        ))}

                        {cat.questions.length === 0 && (
                            <div className="text-center text-muted py-3 fs-13 border-top">
                                <i className="ri-inbox-line me-1" />Henüz soru eklenmedi
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <SaveButton onClick={() => saveFaqs(faqs)} isSaving={isSaving} />
        </div>
    );
};

