import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container, 
  Input, 
  Row, 
} from "reactstrap"; 
import { ToastContainer } from "react-toastify";  
import BreadCrumb from "components/Common/BreadCrumb";
import { useGetRoleUsersAll } from "hooks/useRole";
import config from "config";
import { AuthUser } from "context/AuthContext";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";

const Team = () => {
  const { data:brand } = useGetBrand();
  document.title = "Team | " +(brand?.companyName || "Workgrid");

  const { data: users, isLoading, isError } = useGetRoleUsersAll();
  const [isList, setList] = useState<boolean>(true);
  const [teamList, setTeamlist] = useState<AuthUser[] | undefined>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { 
    setTeamlist(users?.filter(u => u.roles[0] != "EndUser")); 
  }, [users]); 

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    if (!users) return;
    const query = val.toLowerCase().trim();
    if (query === "") {
      setTeamlist(users.filter(u => u.roles[0] != "EndUser"));
      return;
    }
    const filteredData = users.filter((user: any) => {
      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.toLowerCase();
      const designation = (user.jobTitle ?? "").toLowerCase(); 
      return fullName.includes(query) || designation.includes(query);
    });

    setTeamlist(filteredData.filter(u => u.roles[0] != "EndUser"));
  };

  return (
      <React.Fragment>
        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/> 
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Ekip" pageTitle={brand?.companyName || "Workgrid"} />
            <Card>
              <CardBody>
                <Row className="g-2">
                  <Col sm={4} className="ms-auto me-2">
                    <div className="search-box">
                      <Input
                        type="text"
                        value={searchTerm}
                        className="form-control"
                        placeholder="İsim veya unvana göre ara..."
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col className="col-sm-auto">
                    <div className="list-grid-nav hstack gap-1">
                      <Button
                        color="info"
                        id="grid-view-button"
                        onClick={()=>setList(false)}
                        className={`btn btn-primary nav-link btn-icon fs-14 filter-button ${!isList?"active":""}`}
                      >
                        <i className="ri-grid-fill"></i>
                      </Button>
                      <Button
                        color="info"
                        id="list-view-button"
                        onClick={()=>setList(true)}
                        className={`btn btn-primary nav-link btn-icon fs-14 filter-button ${isList?"active":""}`}
                      >
                        <i className="ri-list-unordered"></i>
                      </Button> 
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Row>
              <Col lg={12}>
                <div id="teamlist"> 
                  { isList ? ( 
                    <Row>
                      <Col lg={12}>
                        <div id="teamlist">
                          <div className="d-flex flex-column gap-2">
                            {(teamList || []).map((item: AuthUser, key: any) => (
                              <Card key={key} className="team-list-row border mb-0 shadow-none rounded-3 overflow-hidden" style={{ transition: "all 0.2s" }}>
                                <CardBody className="p-3">
                                  <Row className="align-items-center">
                                    <Col md={4} sm={6} className="d-flex align-items-center gap-3">
                                      <div className="avatar-md img-thumbnail rounded-circle flex-shrink-0" style={{ width: "55px", height: "55px" }}>
                                        {item.profilePictureUrl != null ? (
                                          <img
                                            src={`${config.api.FILE_API_URL}/File/${item?.profilePictureUrl}`}
                                            alt=""
                                            className="img-fluid d-block rounded-circle"
                                            style={{ aspectRatio: "1/1", width: "100%", height: "100%", objectFit: "cover" }}
                                          />
                                        ) : (
                                          <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary font-size-14 font-weight-semibold" style={{ height: "100%" }}>
                                            {(item.firstName ?? "").charAt(0) +
                                              (item.firstName ?? "")
                                                .split(" ")
                                                ?.slice(-1)
                                                .toString()
                                                .charAt(0)}
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="text-truncate">
                                        <h5 className="fs-14 mb-1 text-truncate">
                                          <Link to={`/profile/${item.id}`} className="text-body font-weight-medium">
                                            {item.firstName} {item.lastName}
                                          </Link>
                                        </h5>
                                        <p className="text-muted fs-12 mb-0 text-truncate">
                                          {(item as any).jobTitle ?? "Yazılım Geliştirici"}
                                        </p>
                                      </div>
                                    </Col>

                                    <Col md={2} className="d-none d-md-block text-center border-end border-end-dashed">
                                      <span className="text-muted fs-12 d-block">Projeler</span>
                                      <span className="badge bg-light text-dark font-size-12 px-2.5 py-1 mt-1 border">0 Proje</span>
                                    </Col>

                                    <Col md={2} className="d-none d-md-block text-center me-auto">
                                      <span className="text-muted fs-12 d-block">Görevler</span>
                                      <span className="badge bg-light text-dark font-size-12 px-2.5 py-1 mt-1 border">1 Görev</span>
                                    </Col>

                                    <Col md={3} sm={6} className="col-auto ms-auto">
                                      <div className="d-flex gap-2 justify-content-end">
                                        <Link
                                          to={`/profile/${item.id}`}
                                          className="btn btn-light d-flex align-items-center gap-1 border py-1.5 px-3 fs-12 text-muted"
                                        >
                                          <i className="ri-user-3-line"></i>
                                          Profil
                                        </Link>
                                        <Link
                                          to="/chat"
                                          className="btn btn-primary d-flex align-items-center gap-1 py-1.5 px-3 fs-12"
                                        >
                                          <i className="ri-message-3-line"></i>
                                          Mesaj Gönder
                                        </Link>
                                      </div>
                                    </Col>

                                  </Row>
                                </CardBody>
                              </Card>
                            ))}

                            {isLoading && <Loader isText />}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ):(
                  <Row className="team-list grid-view-filter">
                    {(teamList || []).map((item: AuthUser, key: any) => (
                      <Col key={key} xl={3} lg={4} sm={6} xs={12}>
                        <Card className="team-box border border-2 rounded">
                          <div className="team-cover " style={{height:"100px"}}> </div>
                          <CardBody className="p-4">
                            <Row className="align-items-center team-row"> 
                              <Col lg={4} className="col">
                                <div className="team-profile-img">
                                  <div className="avatar-lg img-thumbnail rounded-circle flex-shrink-0 mt-4">
                                    {item.profilePictureUrl != null ? (
                                      <img
                                        src={`${config.api.FILE_API_URL}/File/${item?.profilePictureUrl}` }
                                        alt=""
                                        className="img-fluid d-block rounded-circle"
                                        style={{ aspectRatio: "1/1" }}
                                      />
                                    ) : (
                                      <div className="avatar-title text-uppercase border rounded-circle bg-light text-primary">
                                        {item.firstName.charAt(0) +
                                          item.firstName
                                            .split(" ")
                                            ?.slice(-1)
                                            .toString()
                                            .charAt(0)}
                                      </div>
                                    )}
                                  </div> 
                                </div>
                              </Col>
                              <Col lg={4} className="col">
                                <Row className="text-muted text-center">
                                  <Col xs={6} className="border-end border-end-dashed">
                                    <h5 className="mb-1">0</h5>
                                    <p className="text-muted mb-0">Projeler</p>
                                  </Col>
                                  <Col xs={6}>
                                    <h5 className="mb-1">1</h5>
                                    <p className="text-muted mb-0">Görevler</p>
                                  </Col>
                                </Row>
                              </Col> 
                              <Col lg={2} className="col">
                                <div className="d-flex gap-2">
                                  <Link
                                    to={`/profile/${item.id}`}
                                    className="btn btn-light d-flex align-items-center justify-content-center gap-2 view-btn border"
                                  >
                                    <i className="ri-eye-line text-muted"></i>
                                    Profili Görüntüle
                                  </Link> 
                                  <Link
                                    to="/chat"
                                    className="btn btn-primary d-flex align-items-center justify-content-center gap-2 view-btn"
                                  >
                                    <i className="ri-message-3-line"></i>
                                    Mesaj Gönder
                                  </Link>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}

                    {isLoading && <Loader isText /> } 
                  </Row>  
                  )}
                </div> 
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
  );
};

export default Team;
