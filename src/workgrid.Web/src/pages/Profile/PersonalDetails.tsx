import { Link } from 'react-router-dom';
import { Col, Form, Input, Label, Row, FormFeedback } from 'reactstrap';
import { useFormik } from "formik";  
import * as Yup from "yup"; 
import { useAuth } from 'context/AuthContext';
import { useUpdateProfile, useUserProfile } from 'hooks/useUser';
import Loader from 'components/Common/Loader';
import { toast } from 'react-toastify'; 

export const PersonalDetails = () => {
    const { user } = useAuth(); 
    const { data: userDetail, isLoading } = useUserProfile(user?.id ?? ""); 

    const { mutateAsync: updateProfileMutation } = useUpdateProfile();

    const validationSchema = Yup.object({
        firstName: Yup.string().required("Lütfen adınızı giriniz"),
        lastName: Yup.string().required("Lütfen soyadınızı giriniz"),
        email: Yup.string().email("Geçersiz e-posta formatı").required("Lütfen e-posta adresinizi giriniz"),
        phoneNumber: Yup.number().required("Lütfen telefon numaranızı giriniz"),
    });
    
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: user?.id ?? "",
            firstName: userDetail?.firstName || "",
            lastName: userDetail?.lastName || "",
            phoneNumber: userDetail?.phoneNumber || "",  
            address: userDetail?.address || "",  
            email: userDetail?.email || "",
            skils: userDetail?.skils || "",  
            designation: userDetail?.designation || "",
            website: userDetail?.website || "",
            city: userDetail?.city || "",
            country: userDetail?.country || "",
            zipCode: userDetail?.zipCode || "",
            description: userDetail?.description || ""
        },
        validationSchema: validationSchema,
        
        onSubmit: async (values) => { 
            try {
                await updateProfileMutation(values, {
                    onSuccess: () => { 
                        toast.success("Profil başarıyla güncellendi!");
                    },
                    onError: () => { 
                        toast.error("Profil güncellenemedi!");
                    }
                }); 
            } catch (error) {
                console.error("Güncelleme hatası:", error);
            }
        }
    });

    if (isLoading) return <div className="pt-4"> <Loader isText={true} /> </div>;  

    return (
        <Form onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
        }}>
            <Row>
                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="firstnameInput" className="form-label">Ad
                            <span className='text-primary'> *</span>
                        </Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="firstnameInput"
                            name="firstName"
                            placeholder="Adınızı giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.firstName || ""}
                            invalid={validation.touched.firstName && validation.errors.firstName ? true : false}
                        />
                        {validation.touched.firstName && validation.errors.firstName && (
                            <FormFeedback type="invalid">{validation.errors.firstName}</FormFeedback>
                        )}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="lastnameInput" className="form-label">Soyad
                            <span className='text-primary'> *</span>
                        </Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="lastnameInput"
                            name="lastName"
                            placeholder="Soyadınızı giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.lastName || ""}
                            invalid={validation.touched.lastName && validation.errors.lastName ? true : false}
                        />
                        {validation.touched.lastName && validation.errors.lastName && (
                            <FormFeedback type="invalid">{validation.errors.lastName}</FormFeedback>
                        )}
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="phonenumberInput" className="form-label">Telefon Numarası
                            <span className='text-primary'> *</span>
                        </Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="phonenumberInput"
                            name="phoneNumber"
                            placeholder="Telefon numaranızı giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phoneNumber || ""}
                        />
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="emailInput" className="form-label">E-posta Adresi
                            <span className='text-primary'> *</span>
                        </Label>
                        <Input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            name="email"
                            placeholder="E-posta adresinizi giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={validation.touched.email && validation.errors.email ? true : false}
                        />
                        {validation.touched.email && validation.errors.email && (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        )}
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="mb-3">
                        <Label htmlFor="skillsInput" className="form-label">Yetenekler</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="skillsInput"
                            name="skils"
                            placeholder="Yeteneklerinizi giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.skils || ""}
                        />
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="designationInput" className="form-label">Unvan</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="designationInput"
                            name="designation"
                            placeholder="Unvanınız"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.designation || ""}
                        />
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="mb-3">
                        <Label htmlFor="websiteInput1" className="form-label">Web Sitesi</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="websiteInput1"
                            name="website"
                            placeholder="www.orneksite.com"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.website || ""}
                        />
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="mb-3">
                        <Label htmlFor="cityInput" className="form-label">Şehir</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="cityInput"
                            name="city"
                            placeholder="Şehir"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.city || ""}
                        />
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="mb-3">
                        <Label htmlFor="countryInput" className="form-label">Ülke</Label>
                        <Input
                            type="text"
                            className="form-control"
                            id="countryInput"
                            name="country"
                            placeholder="Ülke"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.country || ""}
                        />
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="mb-3">
                        <Label htmlFor="zipcodeInput" className="form-label">Posta Kodu</Label>
                        <Input
                            type="text"
                            id="zipcodeInput"
                            name="zipCode"
                            placeholder="Posta kodunu giriniz"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.zipCode || ""}
                            maxLength={6}
                        />
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="mb-3 pb-2">
                        <Label htmlFor="addressTextarea" className="form-label">Adres</Label>
                        <Input
                            type="textarea"
                            className="form-control"
                            id="addressTextarea"
                            name="address"
                            rows={3}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.address || ""}
                        />
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="mb-3 pb-2">
                        <Label htmlFor="exampleFormControlTextarea" className="form-label">Açıklama</Label>
                        <Input
                            type="textarea"
                            className="form-control"
                            id="exampleFormControlTextarea"
                            name="description"
                            rows={3}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.description || ""}
                        />
                    </div>
                </Col>

                <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                        <button type="button" className="btn btn-light border">
                            <Link to={`/profile/${user?.id}`} className='text-dark'>İptal</Link>
                        </button>
                        <button type="submit" className="btn btn-primary">Güncelle</button>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};