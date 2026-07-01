import React, { useState, useEffect } from "react";
import { isEmpty } from "lodash";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik & Yup
import * as Yup from "yup";
import { useFormik } from "formik";


// Assets
import avatar from "../../assets/images/users/avatar-1.jpg";
import { useGetBrand } from "hooks/useBrand";

const UserProfile = () => { 

  const [email, setemail] = useState("admin@gmail.com");
  const [idx, setidx] = useState("1");
  const [userName, setUserName] = useState("Admin");
  const [user, setUser] = useState({});


  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      const obj = JSON.parse(storedUser);

      if (!isEmpty(user)) {
        obj.data.first_name ="workgrid"
        sessionStorage.setItem("authUser", JSON.stringify(obj));
      }

      setUserName(obj.data?.first_name);
      setemail(obj.data?.email);
      setidx(obj.data?._id || "1");
    }
  }, [user]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userName || 'Admin',
      idx: idx || '1',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Lütfen yeni kullanıcı adınızı giriniz"),
    }),
    onSubmit: (values) => {
    }
  });

  const { data: brand } = useGetBrand();
  document.title = "Profil Ayarları | " + (brand?.companyName || "Workgrid");
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img src={avatar} alt="Profil" className="avatar-md rounded-circle img-thumbnail" />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userName || "Admin"}</h5>
                        <p className="mb-1">E-posta: {email}</p>
                        <p className="mb-0">Kullanıcı Kimliği: #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Profil Bilgilerini Düzenle</h4>

          <Card>
            <CardBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label className="form-label">Kullanıcı Adı</Label>
                  <Input
                    name="first_name"
                    className="form-control"
                    placeholder="Yeni kullanıcı adınızı girin"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name || ""}
                    invalid={!!(validation.touched.first_name && validation.errors.first_name)}
                  />
                  {validation.touched.first_name && validation.errors.first_name && (
                    <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                  )}
                  <Input name="idx" value={idx} type="hidden" />
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="primary">
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;