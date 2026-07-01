import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import classnames from "classnames";
import { usePlansContext } from 'context/PlansContext';
// 🌟 Yazdığın Plans Context'i sayfaya dahil ediyoruz

const Plans = () => {
    // 🌟 Context üzerinden dinamik plan verilerini ve yüklenme durumlarını çekiyoruz
    const { plans, isLoading, isError } = usePlansContext();
    
    // true = Monthly, false = Annual fiyatlandırma görünümü
    const [isMonthly, setIsMonthly] = useState<boolean>(true);
    const toggle = () => setIsMonthly(!isMonthly);

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

    if (isError || !plans) {
        return (
            <div className="text-center my-5 py-5 text-danger">
                <i className="ri-error-warning-line fs-32"></i>
                <p className="mt-2">Plan verileri yüklenirken bir hata oluştu!</p>
            </div>
        );
    } 

    return (
        <React.Fragment>
            <section className="section bg-light" id="plans">
                <div className="bg-overlay bg-overlay-pattern"></div>
                <Container>
                    {/* 1. Üst Başlık ve Fiyat Değişim Anahtarı (Responsive) */}
                    <Row className="justify-content-center">
                        <Col lg={8} md={10}>
                            <div className="text-center mb-4 mb-md-5">
                                <h3 className="mb-3 fw-semibold px-2">{plans.title || "Choose the plan that's right for you"}</h3>
                                <p className="text-muted mb-4 px-3">
                                    {plans.description || "Simple pricing. No hidden fees. Advanced features for your business."}
                                </p>

                                {/* Switch Alanı: Mobil için flex-wrap ekledik */}
                                <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                                    <h5 className="fs-14 mb-0">Aylık</h5>
                                    <div className="form-check form-switch fs-20 mx-2" onClick={toggle} style={{ cursor: "pointer" }}>
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id="plan-switch" 
                                            checked={!isMonthly} 
                                            readOnly 
                                        />
                                    </div>
                                    <h5 className="fs-14 mb-0">
                                        Yıllık{" "}
                                        {plans.monthlyDiscountLabel && (
                                            <span className="badge bg-success-subtle text-success ms-1">
                                                {plans.monthlyDiscountLabel}
                                            </span>
                                        )}
                                    </h5>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* 2. Dinamik Kart Listesi (Responsive Col Yapısı) */}
                    <Row className="gy-4 justify-content-center">
                        {plans.items?.map((item) => {
                            return (
                                // Mobil: Tam genişlik (12), Tablet: Yarım genişlik (6), Masaüstü: 3'lü (4)
                                <Col xs={12} md={6} lg={4} key={item.id}>
                                    <Card 
                                        className={classnames("plan-box mb-0 border border-2 h-100", { // h-100 ekledim ki kartlar eşit boyda olsun
                                            "ribbon-box right": item.isPopular
                                        })}
                                    >
                                        <CardBody className="p-4 m-2">
                                            {item.isPopular && (
                                                <div className="ribbon-two ribbon-two-danger">
                                                    <span>Popüler</span>
                                                </div>
                                            )}

                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-1 fw-semibold">{item.name}</h5>
                                                    <p className="text-muted mb-0">{item.subTitle}</p>
                                                </div>
                                                <div className="avatar-sm">
                                                    <div className="avatar-title bg-light rounded-circle text-primary">
                                                        <i className={classnames(item.icon || "ri-book-mark-line", "fs-20")}></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="py-4 text-center">
                                                {isMonthly ? (
                                                    <h1 className="month">
                                                        <sup><small>$</small></sup>
                                                        <span className="ff-secondary fw-bold">{item.priceMonthly}</span>
                                                        <span className="fs-13 text-muted">/Ay</span>
                                                    </h1>
                                                ) : (
                                                    <h1 className="annual">
                                                        <sup><small>$</small></sup>
                                                        <span className="ff-secondary fw-bold">{item.priceAnnual}</span>
                                                        <span className="fs-13 text-muted">/Yıl</span>
                                                    </h1>
                                                )}
                                            </div>

                                            <div>
                                                <ul className="list-unstyled text-muted vstack gap-3 ff-secondary">
                                                    {item.features?.map((feature, featIdx) => (
                                                        <li key={featIdx}>
                                                            <div className="d-flex">
                                                                <div className="flex-shrink-0 me-1">
                                                                    <i className={`fs-15 align-middle ${
                                                                        feature.isIncluded 
                                                                            ? "ri-checkbox-circle-fill text-success" 
                                                                            : "ri-close-circle-fill text-danger"
                                                                    }`}></i>
                                                                </div>
                                                                <div className="flex-grow-1" dangerouslySetInnerHTML={{ __html: feature.text }} />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                                
                                                <div className="mt-4">
                                                    <Link to="#" className="btn btn-soft-primary w-100">
                                                        Başla
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Plans;