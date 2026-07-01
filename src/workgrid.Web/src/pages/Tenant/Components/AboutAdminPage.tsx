import React, { useState, useEffect } from "react";
import { Card, CardBody, Spinner } from "reactstrap";
import { Upload } from "antd"; 
import { toast } from "react-toastify";

// CKEditor İmportları (Projene göre import yolunu kontrol edebilirsin)
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { useAboutContext } from "context/AboutContext";
import { useUploadFile } from "hooks/useFiles";
import { SectionHead } from "./SectionHead";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { SaveButton } from "./SaveButton";
import config from "config";

const resolveImg = (url: string) =>
    !url ? "" : url.startsWith("http") ? url : `${config.api.FILE_API_URL}/File/${url}`;

export const AboutAdminPage = () => {
    const { about, isLoading, isError, saveAbout, isSaving } = useAboutContext();
    const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

    const [draft, setDraft] = useState({ url: "", description: "" });

    useEffect(() => {
        if (about) setDraft({ url: about.url || "", description: about.description || "" });
    }, [about]);

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState />;

    const customUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const fileName = await uploadFile(file);
            setDraft((prev) => ({ ...prev, url: fileName }));
            onSuccess("ok");
        } catch {
            toast.error("Görsel yüklenemedi");
            onError(new Error("upload failed"));
        }
    };

    const removeImage = () => setDraft((prev) => ({ ...prev, url: "" }));

    const handleSave = () => {
        if (!draft.description.trim()) { toast.error("Bir açıklama girin"); return; }
        saveAbout(draft, {
            onError: () => toast.error("Kaydedilemedi"),
        });
    };

    return (
        <div>
            <SectionHead
                icon="ri-information-line"
                title="Hakkımızda"
                subtitle="Şirketinizi tanıtan görsel ve açıklamayı düzenleyin"
            />

            <Card>
                <CardBody>
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <label className="form-label fw-medium">Görsel</label>
                            <div className="about-admin-upload">
                                <Upload
                                    customRequest={customUpload}
                                    listType="picture-card"
                                    maxCount={1}
                                    showUploadList={false}
                                    className="about-admin-upload-control"
                                >
                                    {draft.url ? (
                                        <div className="about-admin-preview">
                                            <img src={resolveImg(draft.url)} alt="Hakkımızda görseli" />
                                        </div>
                                    ) : isUploading ? (
                                        <Spinner />
                                    ) : (
                                        <div>
                                            <i className="ri-upload-cloud-2-line fs-22 d-block mb-1" />
                                            Görsel yükle
                                        </div>
                                    )}
                                </Upload>
                                {draft.url && (
                                    <button
                                        type="button"
                                        className="about-admin-remove"
                                        onClick={removeImage}
                                    >
                                        <i className="ri-delete-bin-line me-1" /> Görseli kaldır
                                    </button>
                                )}
                            </div>
                            <div className="form-text">Geniş bir görsel (örn. ofis, ekip fotoğrafı) iyi sonuç verir.</div>
                        </div>

                        <div className="col-lg-8">
                            <label className="form-label fw-medium">
                                Açıklama
                            </label>
                            {/* TEXTAREA YERİNE CKEDITOR ENTEGRASYONU */}
                            <div className="ckeditor-wrapper">
                                <CKEditor
                                    editor={ClassicEditor as any}
                                    data={draft.description}
                                    onChange={(_e, editor) => {
                                        const data = editor.getData();
                                        setDraft((p) => ({ ...p, description: data }));
                                    }}
                                />
                            </div>
                            <div className="form-text">
                                Metin HTML formatında kaydedilecektir.
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <SaveButton onClick={handleSave} isSaving={isSaving} />

            <style>{`
                /* CKEditor'ün varsayılan minimum yüksekliğini ayarlamak için */
                .ck-editor__editable_inline {
                    min-height: 245px !important; 
                }
                .about-admin-upload-control .ant-upload.ant-upload-select {
                    width: 100% !important;
                    height: 220px !important;
                    border-radius: 10px;
                }
                .about-admin-preview {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .about-admin-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .about-admin-remove {
                    margin-top: 10px;
                    border: none;
                    background: transparent;
                    color: var(--vz-danger, #f06548);
                    font-size: 13px;
                    padding: 0;
                    cursor: pointer;
                }
                .about-admin-remove:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};