import { useGetBrand } from 'hooks/useBrand';
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => {
    const { data:brand } = useGetBrand();
    return (
        <React.Fragment>
            <footer className="footer border-top">
                <Container fluid>
                    <Row>
                        <Col sm={8}> 
                            <ul className="list-unstyled d-flex gap-2 align-items-center">
                                <li><Link to="/about" className='text-muted'>About Us</Link></li>
                                <i  className='bx bxs-circle' style={{fontSize:"3px"}}></i>
                                <li><Link to="/gallery" className='text-muted'>Gallery</Link></li>
                                <i  className='bx bxs-circle' style={{fontSize:"3px"}}></i>
                                <li><Link to="/faqs" className='text-muted'>FAQ</Link></li>
                                <i  className='bx bxs-circle' style={{fontSize:"3px"}}></i>
                                <li><Link to="/contacts" className='text-muted'>Contact</Link></li>
                            </ul>
                        </Col>
                        <Col sm={4}>
                        <div className='row'>
                            <div className="text-sm-end d-none d-sm-block">
                                <span className='me-2'>{new Date().getFullYear()} © Workgrid. </span>
                                Design & Develop by 
                                <i className="ri-linkedin-box-fill px-1 fs-5"></i> 
                                <a target="_blank" href="https://www.linkedin.com/in/aysenur-aydin1/" className="fw-medium link-primary">Ayşenur Aydın</a>
                            </div>
                        </div>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;



