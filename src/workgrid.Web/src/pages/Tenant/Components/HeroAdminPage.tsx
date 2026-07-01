import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useGetLandingHero, useUpdateLandingHero } from 'hooks/useHero';
import { Upload, message } from 'antd';
import { useUploadFile } from 'hooks/useFiles';
import { toast } from 'react-toastify';
import config from 'config';
import { Button, Col, Row, Spinner } from 'reactstrap';
import Home from 'pages/Landing/components/home'; 
import { useGetBrand } from 'hooks/useBrand';

export const HeroAdminPage = () => {
    const { data:brand } = useGetBrand();
    const { data: heroData, isLoading } = useGetLandingHero();
    const { mutate: updateHero } = useUpdateLandingHero();
    const { mutateAsync: uploadFile } = useUploadFile();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: heroData?.title || '',
            description: heroData?.description || '',
            sliderImages: heroData?.sliderImages || []
        },
        onSubmit: (values) => {
            updateHero(values, { onSuccess: () => toast.success("Kaydedildi!") });
        }
    });

    const customUpload = async (options: any) => {
        const { file, onSuccess } = options;
        try {
            const fileName = await uploadFile(file);
            const currentImages = [...formik.values.sliderImages, fileName];
            formik.setFieldValue('sliderImages', currentImages);
            onSuccess("ok");
        } catch { toast.error("Yükleme hatası"); }
    };

    if (isLoading) return <div>Yükleniyor...</div>;
    return(
        <Row>
            <Col sm={6}>
                <Home/>
            </Col>
            <Col sm={6}>
                <form  onSubmit={formik.handleSubmit}>
                    {/* İçerik Alanları */}
                    <div className="mb-4">
                        <div className="mb-3">
                            <label htmlFor="hero-title" className="form-label fw-medium">
                                Başlık
                            </label>
                            <input
                                id="hero-title"
                                name="title"
                                type="text"
                                className="form-control"
                                placeholder={brand?.companyName || "Workgrid"}
                                value={formik.values.title}
                                onChange={formik.handleChange} 
                            />
                        </div>
                        <div>
                            <label htmlFor="hero-desc" className="form-label fw-medium">
                                Açıklama
                            </label>
                            <textarea
                                id="hero-desc"
                                name="description"
                                className="form-control"
                                placeholder="Kısa bir açıklama girin..."
                                rows={3}
                                value={formik.values.description}
                                onChange={formik.handleChange} 
                            />
                        </div>
                    </div>
                    <Upload
                        customRequest={customUpload}
                        listType="picture-card"
                        fileList={formik.values.sliderImages.map((url:string, i:number) => ({
                            uid: i.toString(),
                            name: url,
                            status: 'done',
                            url: `${config.api.FILE_API_URL}/File/${url}`
                        }))}
                        onRemove={(file) => {
                            const filtered = formik.values.sliderImages.filter((img:string)=> img !== file.name);
                            formik.setFieldValue('sliderImages', filtered);
                        }}
                    >
                        <div>Ekle</div>
                    </Upload>
                    <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                        <Button color="primary" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <><Spinner size="sm" className="me-1" />Kaydediliyor...</>
                            ) : (
                                <><i className="ri-save-3-line me-1" />Değişiklikleri Kaydet</>
                            )}
                        </Button>
                    </div>
                </form>
            </Col>
        </Row>
    )
};