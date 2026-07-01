import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Container, Row, Table } from 'reactstrap';
import BreadCrumb from 'components/Common/BreadCrumb';
import { useAuth } from 'context/AuthContext';
import config from 'config';
import { useUserProfile } from 'hooks/useUser';
import { getUserInitials } from 'common/utils/getUserInitials'; 
import { useGetBrand } from 'hooks/useBrand';
import { CommentList } from 'pages/Comment';
import { CommentItemType } from 'common/data/comment';

export const Profile = () => { 
    const { data: brand } = useGetBrand();
    const { id } = useParams<{ id: string }>();
    const { data: user } = useUserProfile(id ?? ""); 
    const { user: usr } = useAuth(); 
    
    const currentImageSrc = user?.profilePictureUrl 
            ? `${config.api.FILE_API_URL}/File/${user.profilePictureUrl}` 
            : null;
            
    document.title = `Profil | ${brand?.companyName || "Workgrid"}`;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Profil" pageTitle={brand?.companyName || "Workgrid"} /> 
                    <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                        <Row className="g-4"> 
                            <div className="col-auto">
                                {!currentImageSrc ? (
                                    <div className="avatar-title border border-2 bg-light text-primary rounded-circle text-uppercase font-weight-bold fs-24" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        {getUserInitials(user?.firstName ?? "", user?.lastName ?? "")}
                                    </div>
                                ) : (  
                                    <div className="avatar-lg">
                                        <img src={currentImageSrc} alt="Profil"
                                        style={{ aspectRatio: "1/1" }}
                                        className="img-thumbnail object-fit-cover rounded-circle" />
                                    </div>
                                )}
                            </div>

                            <Col>
                                <div className="p-2">
                                    <h3 className="mb-1">{user?.username}</h3>
                                    <p className="text-muted">{user?.roles}</p>
                                    <div className="hstack text-muted gap-1">
                                        <div className="me-2"><i className="ri-map-pin-user-line me-1 fs-16 align-bottom text-body"></i>{user?.city ?? "---"}, {user?.country ?? "---"}</div>
                                        <div><i className="ri-building-line me-1 fs-16 align-bottom text-body"></i>{user?.companyName ?? "---"}</div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} className="col-lg-auto order-last order-lg-0">
                                <Row className="text-center">
                                    <Col lg={6} xs={4}>
                                        <div className="p-2">
                                            <h4 className="mb-1">24.3K</h4>
                                            <p className="fs-14 text-muted mb-0">Takipçi</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} xs={4}>
                                        <div className="p-2">
                                            <h4 className="mb-1">1.3K</h4>
                                            <p className="fs-14 text-muted mb-0">Takip Edilen</p>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row className="d-flex justify-content-end">
                                    {id === usr?.id ? (
                                        <Link to="/profile-settings" className="btn btn-sm btn-primary">
                                            <i className="ri-edit-box-line align-bottom"></i> Profili Düzenle
                                        </Link>
                                    ) : (
                                        <Link to="/chat" className="btn btn-sm btn-primary">
                                            <i className="ri-user-fill align-bottom me-2"></i> Mesaj Gönder
                                        </Link>
                                    )}
                                </Row>
                            </Col>
                        </Row>
                    </div>

                    <Row>
                        <Col xxl={4}> 
                            <Card>
                                <CardBody>
                                    <h5 className="card-title mb-3">Bilgiler</h5>
                                    <div className="table-responsive">
                                        <Table className="table-borderless mb-0">
                                            <tbody>
                                                {[
                                                    { label: "Ad Soyad", value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "---" },
                                                    { label: "Telefon", value: user?.phoneNumber ?? "---" },
                                                    { label: "E-posta", value: user?.email ?? "---" },
                                                    { label: "Konum", value: (user?.city || user?.country) ? `${user?.city ?? "---"}, ${user?.country ?? "---"}` : "---" },
                                                    { label: "Katılım Tarihi", value: user?.joiningDate ?? "---" }
                                                ].map((item, idx) => (
                                                    <tr key={idx}>
                                                        <th className="ps-0" scope="row">{item.label} :</th>
                                                        <td className="text-muted">{item.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </CardBody>
                            </Card> 
                            <Card>
                                <CardBody>
                                    <h5 className="card-title mb-4">Yetenekler</h5>
                                    <div className="d-flex flex-wrap gap-2 fs-15">
                                        {user?.skils?.split(",").filter(s => s.trim()).map((skil, index) => (
                                            <span key={index} className="badge bg-primary-subtle text-primary">{skil.trim()}</span> 
                                        )) || "---"}
                                    </div>
                                </CardBody>
                            </Card> 
                        </Col>
                        <Col xxl={8}>
                            <Card>
                                <CardBody>
                                    <h5 className="card-title mb-3">Hakkında</h5>
                                    <p>{user?.description ?? "---"}</p>
                                    <Row>
                                        <Col xs={6} md={4}>
                                            <div className="d-flex mt-4">
                                                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                                    <div className="avatar-title bg-light rounded-circle fs-16 text-primary"><i className="ri-user-2-fill"></i></div>
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="mb-1">Unvan :</p>
                                                    <h6 className="text-truncate mb-0">{user?.designation ?? "---"}</h6>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={6} md={4}>
                                            <div className="d-flex mt-4">
                                                <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                                                    <div className="avatar-title bg-light rounded-circle fs-16 text-primary"><i className="ri-global-line"></i></div>
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <p className="mb-1">Web Sitesi :</p>
                                                    <a href={user?.website} target="_blank" rel="noreferrer" className="fw-semibold">{user?.website ?? "---"}</a>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card> 
                            <CommentList itemType={CommentItemType.User} itemId={id!} />
                        </Col>
                    </Row> 
                </Container>
            </div>
        </React.Fragment>
    );
};