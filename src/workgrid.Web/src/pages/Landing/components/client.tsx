import React from 'react';
import { Col, Container, Row } from 'reactstrap';

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// 🌟 Dinamik veri akışı için oluşturduğumuz context hook'larını dahil ediyoruz 
import { useClientItemsContext } from "context/ClientItemsContext"; 
import { useGetBrand } from 'hooks/useBrand';

const Client = () => {
    // 🌟 Context'lerden dinamik verileri çekiyoruz
    const { data:brand } = useGetBrand();
    const { clients, isLoading, isError } = useClientItemsContext();

    // Veriler yüklenirken veya hata oluştuğunda slider'ın boş kalıp tasarımı bozmaması için fallback kontrolü
    if (isLoading) return null; 
    if (isError || !clients || clients.length === 0) return null;

    return (
        <React.Fragment>
            <div className="pt-5 mt-5">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-5">
                                
                                {/* 🌟 Başlık alanını ve açıklamayı BrandConfig'den gelen veriyle dinamikleştirdik */}
                                <h5 className="fs-20">
                                    Trusted <span className="text-primary text-decoration-underline">by</span> {brand?.companyName || "the world's best"}
                                </h5>
                                {brand?.description && (
                                    <p className="text-muted mt-2 max-w-2xl mx-auto fs-14">
                                        {brand.description}
                                    </p>
                                )}

                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    breakpoints={{
                                        576: { slidesPerView: 2 },
                                        768: { slidesPerView: 3 },
                                        1024: { slidesPerView: 4 },
                                    }}
                                    loop={clients.length >= 4} // 💡 Koruma: Eğer eklenen logo sayısı slide sayısından azsa Swiper'ın sapıtmaması için dinamik loop
                                    autoplay={{ delay: 1000, disableOnInteraction: false }}
                                    modules={[Pagination, Autoplay]}
                                    className="mySwiper swiper trusted-client-slider mt-sm-5 mt-4 mb-sm-5 mb-4"
                                >
                                    {/* 🌟 Statik logolar yerine veritabanından gelen listeyi dönüyoruz */}
                                    {clients.map((client) => {
                                        return (
                                            <SwiperSlide key={client.id}>
                                                <div className="client-images" style={{ height: "45px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <img 
                                                        src={client.logoUrl} 
                                                        alt={client.name || "client-img"} 
                                                        className="mx-auto img-fluid d-block" 
                                                        style={{ maxHeight: "100%", objectFit: "contain" }}
                                                        onError={(e) => {
                                                            // Eğer url patlarsa slider yapısı kırılmasın diye görünmez yapıyoruz
                                                            (e.target as HTMLElement).style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>

                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Client;