import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { IFeatureItem, IFeatureDetail } from 'common/data/tenant';
import config from "config";
import { useGetLandingFeatures } from 'hooks/useFeatures';

const Features = () => {
    const { data: features, isLoading, isError } = useGetLandingFeatures();

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (isError || !features) {
        return <div className="text-center py-5 text-danger">Özellikler yüklenirken bir hata oluştu.</div>;
    }

    return (
        <React.Fragment>
            {[...features]
                .sort((a, b) => a.orderNumber - b.orderNumber)
                .map((item: IFeatureItem, index: number) => {
                    
                    const imgPreview = item.imageUrl?.startsWith("http")
                        ? item.imageUrl
                        : `${config.api.FILE_API_URL}/File/${item.imageUrl}`;

                    return (
                        <section 
                            key={item.id || index} 
                            className="section"  
                            style={{ backgroundColor: item.bgColor || '#ffffff' }}
                        >
                            <Container>
                                <Row className={`align-items-center mt-5 pt-lg-5 gy-4 ${item.isRight ? "flex-row-reverse" : ""}`}>
                                    
                                    <Col lg={6} sm={7} className="col-10 mx-auto">
                                        <div>
                                            <img src={imgPreview} alt={item.title} className="img-fluid" />
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className={`text-muted ${item.isRight ? "pe-lg-5" : "ps-lg-5"}`}>
                                            
                                            {item.subTitle && (
                                                <h5 className="fs-12 text-uppercase text-primary">
                                                    {item.subTitle} 
                                                </h5>
                                            )}
                                            
                                            <h4 className="mb-3">
                                                <i className={`${item.iconUrl} me-2 fs-24`} />
                                                {item.title}
                                            </h4>
                                            
                                            <p className="mb-4">{item.description}</p>

                                            {item.featuresDetails && item.featuresDetails.length > 0 && (
                                                <div className="vstack gap-2">
                                                    {item.featuresDetails.map((detail: IFeatureDetail) => (
                                                        <div key={detail.id} className="d-flex align-items-center">
                                                            <div className="flex-shrink-0 me-2">
                                                                <i className={`fs-18 ${detail.isApproved ? "ri-checkbox-circle-fill text-primary" : "ri-close-circle-fill text-danger"}`} />
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <p className="mb-0">
                                                                    {detail.value && <strong className="text-body me-1">{detail.value}</strong>}
                                                                    {detail.label}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    );
                })}
        </React.Fragment>
    );
};

export default Features;