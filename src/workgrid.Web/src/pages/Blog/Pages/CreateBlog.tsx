import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Input, Label, Row } from "reactstrap";
import { Image } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import BreadCrumb from "components/Common/BreadCrumb";
import { useGetBrand } from "hooks/useBrand";
import { useGridbaseAll, useGridbaseById, useCreateRow, useUpdateRow } from "hooks/useGridBase";
import config from "config";
import { toast } from "react-toastify";
import { WGBlog, WGBlogCategory } from "common/data/blog"; 
import useThemeMode from "hooks/useThemeMode";
import { LogoUploadField } from "pages/Tenant/ThemaSettings/Components/LogoUploadField";
import { BLOG_TABLE, CATEGORY_BLOG_TABLE } from "common/data/constans";

const CreateBlog = () => {
    const { id }       = useParams<{ id?: string }>();
    const isEdit       = !!id;
    const navigate     = useNavigate();
    const { data: brand } = useGetBrand();
    document.title = (isEdit ? "Düzenle" : "Yeni Blog") + " | " + (brand?.companyName || "Workgrid");

    const { data: categories = [] } = useGridbaseAll(CATEGORY_BLOG_TABLE) as { data: WGBlogCategory[] };
    const { data: existing, isLoading: loadingExisting } = useGridbaseById(BLOG_TABLE, isEdit ? Number(id) : 0) as { data: WGBlog | undefined; isLoading: boolean };
    const {mutate:createBlog} = useCreateRow(BLOG_TABLE);
    const {mutate: updateBlog} = useUpdateRow(BLOG_TABLE);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput,     setTagInput]     = useState("");

    React.useEffect(() => {
        if (existing?.tags) {
            setSelectedTags(existing.tags.split(",").map((t: string) => t.trim()).filter(Boolean));
        }
    }, [existing]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title:      existing?.title       ?? "",
            description: existing?.description ?? "",
            content: existing?.content ?? "",
            image:      existing?.image        ?? "",
            categoryId: existing?.wGBlogCategoryId ?? ("" as number | ""),
            priority:   existing?.priority    ?? "Medium",
            status:     existing?.status      ?? "Inprogress",
        },
        validationSchema: Yup.object({
            title:       Yup.string().trim().required("Başlık zorunlu."),
            description: Yup.string().required("Açıklama zorunlu."),
            content: Yup.string().required("İçerik zorunlu."),
        }),
        onSubmit: async (values, { setStatus }) => {
            const payload = {
                title:             values.title.trim(),
                description:       values.description,
                content:       values.content,
                image:             values.image,
                tags:              selectedTags.join(","),
                WGBlogCategoryId:  values.categoryId,
                priority:          values.priority,
                status:            values.status,
            };


            try {
                if (isEdit) {
                    updateBlog({ id: Number(id), payload }, {
                        onSuccess: () => {
                            toast.success("Blog başarıyla güncellendi!")
                            setTimeout(() => {
                                navigate("/blog-list");
                            }, 1400);
                        },
                        onError: ()=>toast.success("Blog başarıyla güncellenemedi!")
                        });
                } else {
                    createBlog(payload, {
                        onSuccess: () => {
                            toast.success("Blog başarıyla oluşturuldu!!")
                            setTimeout(() => {
                                navigate("/blog-list");
                            }, 1400);
                        },
                        onError: ()=>toast.success("Blog oluşturulamadı!")
                    });
                } 
            } catch {
                setStatus(isEdit ? "Blog güncellenemedi." : "Blog oluşturulamadı.");
            }
        },
    });

    const { mode } = useThemeMode(); 
    const isDark = mode == "dark";
    const isExternal = formik.values.image?.startsWith("http") || formik.values.image?.startsWith("/");
    const previewUrl = formik.values.image
        ? (isExternal ? formik.values.image : `${config.api.FILE_API_URL}/File/${formik.values.image}`)
        : "";

    if (isEdit && loadingExisting) return (
        <div className="page-content">
            <Container fluid>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" />
                    <p className="text-muted mt-2 mb-0 small">Yükleniyor…</p>
                </div>
            </Container>
        </div>
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title={isEdit ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı"} pageTitle={brand?.companyName || "Workgrid"} />
                    {formik.status && (
                        <div className="alert alert-danger" role="alert">{formik.status}</div>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        <Row className="g-3">
                            {/* SOL KOLON */}
                            <Col lg={8}>
                                <Card className="border border-2 mb-0">
                                    <CardBody className="p-4">
                                        <div className="mb-3">
                                            <Label className="form-label fw-medium" htmlFor="title">Blog Başlığı <span className="text-danger">*</span></Label>
                                            <Input
                                                type="text" id="title" name="title"
                                                placeholder="Başlığı buraya girin"
                                                value={formik.values.title}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={!!(formik.touched.title && formik.errors.title)}
                                            />
                                            {formik.touched.title && formik.errors.title && (
                                                <div className="text-danger fs-12 mt-1">{String(formik.errors.title)}</div>
                                            )}
                                        </div>
                                        <div className="mb-3">
                                            <Label className="form-label fw-medium" htmlFor="description">Kısa Açıklama <span className="text-danger">*</span></Label>
                                            <Input
                                                type="textarea" id="description" name="description"
                                                placeholder="Blog için kısa bir özet girin"
                                                value={formik.values.description}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                invalid={!!(formik.touched.description && formik.errors.description)}
                                            />
                                            {formik.touched.description && formik.errors.description && (
                                                <div className="text-danger fs-12 mt-1">{String(formik.errors.description)}</div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <Label className="form-label fw-medium">Blog İçeriği <span className="text-danger">*</span></Label>
                                            <CKEditor
                                                editor={ClassicEditor as any}
                                                data={formik.values.content}
                                                onChange={(_e, editor) => formik.setFieldValue("content", editor.getData())}
                                                onBlur={() => formik.setFieldTouched("content", true)}
                                            />
                                            {formik.touched.content && formik.errors.content && (
                                                <div className="text-danger fs-12 mt-1">{String(formik.errors.content)}</div>
                                            )}
                                        </div>

                                        <Row className="g-3">
                                            <Col md={6}>
                                                <Label htmlFor="priority" className="form-label fw-medium">Öncelik Seviyesi</Label>
                                                <select className="form-select" id="priority" name="priority" value={formik.values.priority} onChange={formik.handleChange}>
                                                    <option value="High">Yüksek</option>
                                                    <option value="Medium">Orta</option>
                                                    <option value="Low">Düşük</option>
                                                </select>
                                            </Col>
                                            <Col md={6}>
                                                <Label htmlFor="status" className="form-label fw-medium">Yayın Durumu</Label>
                                                <select className="form-select" id="status2" name="status" value={formik.values.status} onChange={formik.handleChange}>
                                                    <option value="Inprogress">Taslak (Devam Ediyor)</option>
                                                    <option value="Completed">Yayında (Tamamlandı)</option>
                                                </select>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button 
                                        type="button" 
                                        className={`btn btn-soft-light border ${isDark ? "text-light" : "text-dark"}`} 
                                        onClick={() => navigate(-1)}
                                    >
                                        <i className={`ri-close-line fs-16 me-2 ${isDark ? "text-light" : "text-dark"}`} />
                                        <span>İptal</span>
                                    </button>
                                    <button type="submit" className="btn btn-soft-primary">
                                        <i className={`ri-save-3-fill fs-16 me-2`} />
                                        {isEdit ? "Değişiklikleri Kaydet" : "Blogu Oluştur"}
                                    </button> 
                                </div>
                            </Col>

                            {/* SAĞ KOLON */}
                            <Col lg={4}>
                                <Card className="border border-2 mb-3">
                                    <CardBody className="p-4">
                                        <Label className="form-label fw-medium d-block mb-3">Kapak Görseli</Label>
                                        {previewUrl && (
                                            <div className="mb-3 text-center">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Kapak Görseli"
                                                    style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }}
                                                />
                                            </div>
                                        )}
                                        <LogoUploadField
                                            isHeightHidden
                                            label=""
                                            badge="Blog Görseli"
                                            badgeColor="primary"
                                            bg="bg-light"
                                            accept="image/png, image/jpeg, image/gif"
                                            value={formik.values.image}
                                            onChange={(fileName) => formik.setFieldValue("image", fileName)}
                                            onMarkForDeletion={() => {}}
                                        />
                                    </CardBody>
                                </Card>

                                <Card className="border border-2 mb-0">
                                    <CardBody className="p-4">
                                        <div className="mb-4">
                                            <Label htmlFor="categoryId" className="form-label fw-medium">Kategori</Label>
                                            <select
                                                className="form-select" id="categoryId" name="categoryId"
                                                value={formik.values.categoryId}
                                                onChange={(e) => formik.setFieldValue("categoryId", e.target.value ? Number(e.target.value) : "")}
                                            >
                                                <option value="">Kategori seçiniz...</option>
                                                {categories.filter(c => c.name).map(cat => (
                                                    <option key={cat.id} value={cat.id?.toString()}>{cat.id} - {cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <Label className="form-label fw-medium">Etiketler</Label>
                                            <div className="d-flex gap-1 flex-wrap mb-2">
                                                {selectedTags.map((tag, i) => (
                                                    <span key={i} className="badge bg-primary d-inline-flex align-items-center gap-1 py-2 px-2">
                                                        {tag}
                                                        <i className="ri-close-line" style={{ cursor: "pointer" }} onClick={() => setSelectedTags(selectedTags.filter((_, idx) => idx !== i))} />
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Etiket yazın..."
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            const t = tagInput.trim();
                                                            if (t && !selectedTags.includes(t)) { setSelectedTags([...selectedTags, t]); setTagInput(""); }
                                                        }
                                                    }}
                                                />
                                                <button type="button" className="btn btn-sm btn-primary" onClick={() => {
                                                    const t = tagInput.trim();
                                                    if (t && !selectedTags.includes(t)) { setSelectedTags([...selectedTags, t]); setTagInput(""); }
                                                }}>
                                                    <i className="ri-add-line" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </form>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CreateBlog;

