import React from 'react';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import config from 'config';
import { useGetLandingHero } from 'hooks/useHero'; // Hook'unu import et

// Swiper
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { EffectFade, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import imgpattern from "../../../assets/images/landing/img-pattern.png";

const Home = () => {
    const { data: heroData, isLoading } = useGetLandingHero();

    if (isLoading) {
        return <div className="text-center p-5"><Spinner color="primary" /></div>;
    }

    return (
        <React.Fragment>
            <section className="section pb-0 hero-section pt-4" id="hero">
                <div className="bg-overlay bg-overlay-pattern"></div>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} sm={10}>
                            <div className="text-center mt-lg-5">
                                {/* Dinamik Başlık */}
                                <h1 className="display-6 fw-semibold mb-3 lh-base">
                                    {heroData?.title || "Welcome to Workgrid"}
                                </h1>
                                {/* Dinamik Açıklama */}
                                <p className="lead text-muted lh-base">
                                    {heroData?.description || "Manage your website efficiently."}
                                </p>

                                <div className="d-flex gap-2 justify-content-center mt-4">
                                    <Link to="/register" className="btn btn-primary">Get Started <i className="ri-arrow-right-line align-middle ms-1"></i></Link> 
                                </div>
                            </div>

                            <div className='mt-4 mt-sm-5 pt-sm-5 mb-sm-n5 demo-carousel'>
                                <div className="demo-img-patten-top d-none d-sm-block"><img src={imgpattern} className="d-block img-fluid" alt="..." /></div>
                                <div className="demo-img-patten-bottom d-none d-sm-block"><img src={imgpattern} className="d-block img-fluid" alt="..." /></div>
                                
                                {/* Dinamik Swiper */}
                                <Swiper
                                    spaceBetween={30}
                                    effect={"fade"}
                                    loop={true}
                                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                                    modules={[EffectFade, Autoplay]}
                                    className="mySwiper" >

                                    {heroData?.sliderImages?.length > 0 ? (
                                        heroData.sliderImages.map((img: string, idx: number) => (
                                            <SwiperSlide key={idx} className="carousel-inner shadow-lg p-2 bg-white rounded">
                                                <img 
                                                    src={`${config.api.FILE_API_URL}/File/${img}`} 
                                                    className="d-block w-100" 
                                                    alt={`Slide ${idx + 1}`} 
                                                />
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <div className="p-5 text-center bg-white shadow-lg rounded">Görsel bulunamadı.</div>
                                    )}
                                </Swiper>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default Home;