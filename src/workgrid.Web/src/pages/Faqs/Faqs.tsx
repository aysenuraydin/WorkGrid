import React, { useState } from 'react';
import { Card, Col, Collapse, Container, Row } from 'reactstrap';
import classnames from "classnames";
import { FaqProvider, useFaqContext } from 'context/FaqContext';
import faqImg from "../../assets/images/faq-img.png";
import { useGetSocialLinks } from 'hooks/useSocialLinks';
import { useGetBrand } from 'hooks/useBrand';

const Faqs = () => {
    const { data: brand } = useGetBrand(); 
    const { faqs, isLoading, isError } = useFaqContext();
    const { data: links, isLoading: isLinksLoading } = useGetSocialLinks();

    const [openQuestions, setOpenQuestions] = useState<{ [key: string]: number | null }>({});

    const toggleQuestion = (categoryName: string, questionIndex: number) => {
        setOpenQuestions(prev => ({
            ...prev,
            [categoryName]: prev[categoryName] === questionIndex ? null : questionIndex
        }));
    };
    document.title = "FAQs" + (brand?.companyName || "Workgrid");

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="text-center my-5 py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="page-content">
                <div className="text-center my-5 py-5 text-danger">
                    <i className="ri-error-warning-line fs-32"></i>
                    <p className="mt-2">FAQ verileri yüklenirken bir hata oluştu!</p>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card className="rounded-0 bg-primary-subtle mx-n4 mt-n4 border-top border-0 card-border-effect-none">
                                <div className="px-4">
                                    <Row>
                                        <Col xxl={5} className="align-self-center">
                                            <div className="py-4">
                                                <h4 className="display-6 coming-soon-text">Sıkça sorulan sorular</h4>
                                                <p className="text-primary fs-15 mt-3">Sorunuzun cevabını SSS (Sıkça Sorulan Sorular) bölümümüzde bulamazsanız, bizimle her zaman iletişime geçebilir veya e-posta gönderebilirsiniz. En kısa sürede size dönüş yapacağız!</p>

                                                {!isLinksLoading && (links ?? []).length > 0 && (
                                                    <div className="hstack flex-wrap gap-2">
                                                        {links?.map((link, idx) => (
                                                            <a
                                                                key={link.id}
                                                                href={link.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={classnames(
                                                                    "btn btn-label rounded-pill btn-primary"
                                                                )}
                                                            >
                                                                <i className={`${link.iconUrl} label-icon align-middle rounded-pill fs-16 me-2`}></i>
                                                                {link.platform}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                        <div className="col-xxl-3 ms-auto">
                                            <div className="mb-n5 pb-1 faq-img d-none d-xxl-block">
                                                <img src={faqImg} alt="" className="img-fluid" />
                                            </div>
                                        </div>
                                    </Row>
                                </div>
                            </Card>

                            <Row className="justify-content-evenly mb-4">
                                {faqs.map((cat, catIdx) => {
                                    const activeIdx = openQuestions[cat.category] !== undefined
                                        ? openQuestions[cat.category]
                                        : (catIdx === 0 ? 0 : null);

                                    return (
                                        <Col lg={4} key={cat.category || catIdx}>
                                            <div className="mt-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="flex-shrink-0 me-1">
                                                        <i className={classnames(cat.icon || "ri-question-line", "fs-24 align-middle text-primary me-1")}></i>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="fs-16 mb-0 fw-semibold">{cat.category}</h5>
                                                    </div>
                                                </div>

                                                <div className="accordion accordion-border-box">
                                                    {cat.questions?.map((faq, faqIdx) => {
                                                        const isOpen = activeIdx === faqIdx;
                                                        return (
                                                            <div className="accordion-item" key={faqIdx}>
                                                                <h2 className="accordion-header">
                                                                    <button
                                                                        className={classnames(
                                                                            "accordion-button",
                                                                            "fw-medium",
                                                                            { collapsed: !isOpen }
                                                                        )}
                                                                        type="button"
                                                                        onClick={() => toggleQuestion(cat.category, faqIdx)}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        {faq.q}
                                                                    </button>
                                                                </h2>
                                                                <Collapse isOpen={isOpen} className="accordion-collapse">
                                                                    <div className="accordion-body">
                                                                        {faq.a}
                                                                    </div>
                                                                </Collapse>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};


export const MainFaqsPage = () => {
    return (
        <FaqProvider>
            <Faqs/>
        </FaqProvider>
    )
}
