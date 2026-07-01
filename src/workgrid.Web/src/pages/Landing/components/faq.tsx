import React, { useState } from 'react';
import { Col, Container, Row, Collapse } from 'reactstrap';
import classnames from "classnames";
import { useFaqContext } from 'context/FaqContext';

const Faqs = () => {
    const { faqs, isLoading, isError } = useFaqContext();

    const [openQuestions, setOpenQuestions] = useState<{ [key: string]: number | null }>({});

    const toggleQuestion = (categoryName: string, questionIndex: number) => {
        setOpenQuestions(prev => ({
            ...prev,
            [categoryName]: prev[categoryName] === questionIndex ? null : questionIndex
        }));
    };

    // ── Durum Kontrolleri (Loading & Error) ─────────────────────────────────
    if (isLoading) {
        return (
            <div className="text-center my-5 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center my-5 py-5 text-danger">
                <i className="ri-error-warning-line fs-32"></i>
                <p className="mt-2">FAQ verileri yüklenirken bir hata oluştu!</p>
            </div>
        );
    }

    return (
        <React.Fragment>
            <section className="section">
                <Container>
                    {/* Üst Başlık ve İletişim Butonları (Tasarım Birebir Korundu) */}
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h3 className="mb-3 fw-semibold">Frequently Asked Questions</h3>
                                <p className="text-muted mb-4 ff-secondary">
                                    If you can not find answer to your question in our FAQ, you can
                                    always contact us or email us. We will answer you shortly!
                                </p>

                                <div className="hstack gap-2 justify-content-center">
                                    <button type="button" className="btn btn-primary btn-label rounded-pill me-1">
                                        <i className="ri-mail-line label-icon align-middle rounded-pill fs-16 me-2"></i> Email Us
                                    </button>
                                    <button type="button" className="btn btn-soft-secondary btn-label rounded-pill">
                                        <i className="ri-twitter-line label-icon align-middle rounded-pill fs-16 me-2"></i> Send Us Tweet
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* 🌟 Tamamen Dinamik Kategoriler ve Sorular */}
                    <Row className="g-lg-5 g-4">
                        {faqs.map((cat, catIdx) => {
                            // Eğer o kategori için henüz tıklanma yapılmadıysa, ilk sorunun (index 0) açık gelmesini sağlıyoruz
                            const activeIdx = openQuestions[cat.category] !== undefined 
                                ? openQuestions[cat.category] 
                                : (catIdx === 0 ? 0 : null); // İlk kategori varsayılan olarak ilk soruyu açık getirir, diğerleri kapalı başlar.

                            return (
                                <Col lg={6} key={cat.category || catIdx}>
                                    {/* Kategori Başlığı ve İkonu */}
                                    <div className="d-flex align-items-center mb-2">
                                        <div className="flex-shrink-0 me-1">
                                            {/* DB'den gelen ri-icon sınıfını basıyoruz, yoksa fallback ikon */}
                                            <i className={classnames(cat.icon || "ri-question-line", "fs-24 align-middle text-primary me-1")}></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="mb-0 fw-semibold">{cat.category}</h5>
                                        </div>
                                    </div>

                                    {/* Akordeon Gövdesi */}
                                    <div className="accordion custom-accordionwithicon custom-accordion-border accordion-border-box">
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
                                                        <div className="accordion-body ff-secondary">
                                                            {faq.a}
                                                        </div>
                                                    </Collapse>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Faqs;