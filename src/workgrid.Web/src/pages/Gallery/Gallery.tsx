import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Row, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { Image } from 'antd';

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import BreadCrumb from 'components/Common/BreadCrumb';
import { useGetGallery } from 'hooks/useGallery';
import config from 'config';
import { useGetBrand } from 'hooks/useBrand';
import useThemeMode from 'hooks/useThemeMode';

const Gallery = () => {
  const { isDark } = useThemeMode();
  const { data: gallery, isLoading, isError } = useGetGallery();
  const { data: brand } = useGetBrand();

  document.title = "Galeri | " + (brand?.companyName || "Workgrid");

  const dummy = "https://dummyimage.com/100x100/" + (isDark ? "031426" : "F3F6F9") + "/" + (isDark ? "fff" : "969696") + "&text=" + brand?.companyName;

  const imgUrl = (name?: string | null) =>
    !name
      ? dummy
      : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

  const [displayCategory, setCategory] = useState<string>("All");
  const [index, setIndex] = useState<any>(-1);

  const filteredGallery = gallery?.filter(
    ({ category }: any) => displayCategory === category || displayCategory === "All"
  );

  const slideGallery = filteredGallery?.map((item: any) => ({ src: imgUrl(item.url) }));

  const breakpointColumnsObj = {
    default: 4,
    900: 3,
    750: 2,
    500: 1,
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Galeri" pageTitle={brand?.companyName || "Workgrid"} />
          <Row>
            <Col lg={12}>
              <div className="">
                <CardBody>
                  <Row>
                    <Col lg={12}>

                      {isLoading ? (
                        <div className="text-center py-5"><Spinner color="primary" /></div>
                      ) : isError ? (
                        <div className="text-center py-5 text-danger">
                          <i className="ri-error-warning-line fs-32 d-block mb-2"></i>
                          Galeri yüklenirken bir hata oluştu!
                        </div>
                      ) : (filteredGallery?.length ?? 0) === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <i className="ri-image-line fs-32 d-block mb-2 opacity-50"></i>
                          Henüz galeri öğesi yok.
                        </div>
                      ) : (
                        <Masonry
                          breakpointCols={breakpointColumnsObj}
                          className="row gallery-wrapper"
                          columnClassName="my-masonry-grid_column ps-0"
                        >
                          {filteredGallery?.map((item: any, key: any) => (
                            <div className="element-item project designing development" key={item.id ?? key}>
                              <Card className="gallery-box card-border-effect-none">
                                <div className="gallery-container border">
                                  <Image
                                    src={imgUrl(item.url)}
                                    alt={item.name}
                                    width="100%"
                                    height={350}
                                    fallback={dummy}
                                    style={{ objectFit: 'cover' }}
                                    preview={true}
                                  />
                                  <div className="gallery-overlay">
                                    <h5 className="overlay-caption">{item.name}</h5>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          ))}
                        </Masonry>
                      )}

                    </Col>
                  </Row>
                </CardBody>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Lightbox
        index={index}
        slides={slideGallery}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </React.Fragment>
  );
};

export default Gallery;