import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames"; 
import BreadCrumb from 'components/Common/BreadCrumb';
import { ToastContainer } from 'react-toastify';
import { UserCard } from './UserCard';
import { PersonalDetails } from './PersonalDetails';
import { ChangePassword } from './ChangePassword';
import { Experience } from './Experience';
import { useGetBrand } from 'hooks/useBrand';

export const ProfileSettings = () => {
    const { data:brand } = useGetBrand();
    document.title = "Profil Ayarları | " + (brand?.companyName || "Workgrid");

    const [activeTab, setActiveTab] = useState("1");
    const tabChange = (tab : any) => {
        if (activeTab !== tab) setActiveTab(tab);
    }; 

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Profil Ayarları" pageTitle={brand?.companyName || "Workgrid"} />
                    <Row>
                        <Col xxl={3}> <UserCard/> </Col> 
                        <Col xxl={9}>
                            <Card>
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames("text-primary",{ active: activeTab === "1"})}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Kişisel Bilgiler
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames("text-primary",{ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Şifre Değiştir
                                            </NavLink>
                                        </NavItem>
                                        <NavItem >
                                            <NavLink to="#"
                                                className={classnames("text-primary",{ active: activeTab === "3" })}
                                                onClick={() => {
                                                    tabChange("3");
                                                }}
                                                type="button">
                                                <i className="far fa-envelope"></i>
                                                Deneyim
                                            </NavLink>
                                        </NavItem> 
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1"> <PersonalDetails/> </TabPane>

                                        <TabPane tabId="2"> <ChangePassword/> </TabPane>

                                        <TabPane tabId="3"> <Experience/> </TabPane> 
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <ToastContainer  closeButton={true} limit={3} style={{marginTop:"100px"}}/>
            </div>
        </React.Fragment>
    );
};