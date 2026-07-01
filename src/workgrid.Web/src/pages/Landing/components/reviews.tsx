import React from 'react';
import { Col, Container, Row } from 'reactstrap';
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { useTestimonialsContext } from 'context/TestimonialContext';
import { useGetTenantConfig } from 'hooks/useTenant';
// 🌟 Yazdığın Testimonials Context'i sayfaya dahil ediyoruz

const Reviews = () => {
    const { data: tenantConfig, } = useGetTenantConfig(); 
    const { testimonials, isLoading, isError } = useTestimonialsContext();

    // ── Durum Kontrolleri (Loading & Error) ─────────────────────────────────
    if (isLoading) {
        return (
            <div className="text-center my-5 py-5 bg-primary rounded position-relative">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading Reviews...</span>
                </div>
            </div>
        );
    }

    // Eğer veri yüklenirken hata oluştuysa veya hiç yorum yoksa landing page akışını bozmamak için gizleyebiliriz
    if (isError || !testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <section className="section" id="reviews2" style={{backgroundColor:"rgba(var(--vz-primary-rgb), 0.78)"}}>
                <div className="bg-overlay bg-overlay-pattern"></div>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <div className="text-center">
                                {/* Üst Kısımdaki Tırnak İkonu ve Başlık Alanı (Birebir Aynı) */}
                                <div>:
                                    <i className="ri-double-quotes-l text-primary display-3"></i>
                                </div>
                                <h4 className="text-white mb-5">
                                    <span className="text-primary">{testimonials.length}</span>+ Satisfied clients
                                </h4>

                                {/* Swiper Bileşeni (Tüm ayarları, sınıfları ve modülleri eksiksiz korundu) */}
                                <Swiper 
                                    modules={[Navigation, Pagination, Autoplay]} 
                                    pagination={{ clickable: true }} 
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev'
                                    }} 
                                    loop={testimonials.length > 1} // Tek bir yorum gelirse döngüyü güvenli şekilde kapatır
                                    autoplay={{ delay: 2500, disableOnInteraction: false }} 
                                    className="mySwiper swiper client-review-swiper rounded"
                                >
                                    {/* 🌟 Tamamen Dinamik Swiper Slide Döngüsü */}
                                    {testimonials.map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <div className="row justify-content-center">
                                                <div className="col-10">
                                                    <div className="text-white-50">
                                                        {/* Müşteri Yorumu (Dinamik) */}
                                                        <p className="fs-20 ff-secondary mb-4">
                                                            "{item.comment}"
                                                        </p>

                                                        {/* Müşteri Kimlik Bilgileri (Dinamik) */}
                                                        <div>
                                                            <h5 className="text-white">{item.name}</h5>
                                                            <p>- {item.role}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}

                                    {/* Navigasyon Okları ve Sayfalama Noktaları (Tasarım Sınıfları Birebir Aynı) */}
                                    <div className="swiper-button-next bg-white rounded-circle"></div>
                                    <div className="swiper-button-prev bg-white rounded-circle"></div>
                                    <div className="swiper-pagination position-relative mt-2"></div>
                                </Swiper>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Reviews;