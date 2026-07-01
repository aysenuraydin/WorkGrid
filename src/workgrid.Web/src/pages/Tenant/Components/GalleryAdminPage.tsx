import React, { useEffect, useState } from "react";
import {
    Button, Card, CardBody, Input, Modal, ModalBody, ModalHeader, Spinner,
} from "reactstrap";
import { Upload, Image as AntImage } from "antd";
import { toast } from "react-toastify";

import { useUploadFile } from "hooks/useFiles";
import { SectionHead } from "./SectionHead";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import config from "config";
import { useGalleryContext } from "context/Gallerycontext";
import { useGetGallery } from "hooks/useGallery";

const resolveImg = (url: string) =>
    !url ? "" : url.startsWith("http") ? url : `${config.api.FILE_API_URL}/File/${url}`;

interface IDraftItem {
    name: string;
    url: string;
}

export const GalleryAdminPage = () => {
    const {
        items, isLoading, isError,
        addItem, updateItem, deleteItem,
        isAdding, isUpdating, isDeleting,
    } = useGalleryContext();

    const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
    const { data } = useGetGallery(); 

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<IDraftItem>({ name: "", url: "" });
    const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState />;

    const openCreate = () => {
        setEditingId(null);
        setDraft({ name: "", url: "" });
        setModalOpen(true);
    };

    const openEdit = (id: number, name: string, url: string) => {
        setEditingId(id);
        setDraft({ name, url });
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const customUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const fileName = await uploadFile(file);
            setDraft((prev) => ({
                ...prev,
                url: fileName,
                name: prev.name || (file.name as string).replace(/\.[^/.]+$/, ""),
            }));
            onSuccess("ok");
        } catch {
            toast.error("Görsel yüklenemedi");
            onError(new Error("upload failed"));
        }
    };

    const handleSave = () => {
        if (!draft.name.trim()) { toast.error("Bir isim girin"); return; }
        if (!draft.url.trim()) { toast.error("Bir görsel yükleyin"); return; }

        if (editingId !== null) {
            updateItem(
                { id: editingId, name: draft.name, url: draft.url },
                {
                    onSuccess: () => { toast.success("Güncellendi"); closeModal(); },
                    onError: () => toast.error("Güncellenemedi"),
                }
            );
        } else {
            addItem(
                { name: draft.name, url: draft.url },
                {
                    onSuccess: () => { closeModal(); },
                    onError: () => toast.error("Eklenemedi"),
                }
            );
        }
    };

    const confirmDelete = (id: number) => setDeleteTarget(id);
    const cancelDelete = () => setDeleteTarget(null);
    const doDelete = () => {
        if (deleteTarget === null) return;
        deleteItem(deleteTarget, {
            onSuccess: () => toast.success("Silindi"),
            onError: () => toast.error("Silinemedi"),
            onSettled: () => setDeleteTarget(null),
        });
    };

    const isSaving = isAdding || isUpdating;

    return (
        <div>
            <SectionHead
                icon="ri-gallery-line"
                title="Galeri"
                subtitle="Vitrin görsellerinizi ekleyin, düzenleyin ve sıralayın"
                action={
                    <Button color="primary" size="sm" onClick={openCreate}>
                        <i className="ri-add-line me-1" />Görsel ekle
                    </Button>
                }
            />

            {items.length === 0 ? (
                <Card className="border-dashed">
                    <CardBody className="text-center py-5">
                        <i className="ri-image-add-line display-4 text-muted" />
                        <h6 className="mt-3 mb-1">Galeriniz henüz boş</h6>
                        <p className="text-muted fs-13 mb-3">İlk görselinizi ekleyerek başlayın</p>
                        <Button color="primary" size="sm" onClick={openCreate}>
                            <i className="ri-add-line me-1" />Görsel ekle
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <div className="gallery-admin-grid">
                    {items.map((item) => (
                        <div className="gallery-admin-card" key={item.id}>
                            <div className="gallery-admin-thumb">
                                <AntImage
                                    src={resolveImg(item.url)}
                                    alt={item.name}
                                    className="gallery-admin-img"
                                    onError={(e: any) => {
                                        e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                                <div className="gallery-admin-overlay">
                                    <button
                                        type="button"
                                        className="gallery-admin-action"
                                        title="Düzenle"
                                        onClick={() => openEdit(item.id, item.name, item.url)}
                                    >
                                        <i className="ri-pencil-fill" />
                                    </button>
                                    <button
                                        type="button"
                                        className="gallery-admin-action gallery-admin-action--danger"
                                        title="Sil"
                                        onClick={() => confirmDelete(item.id)}
                                    >
                                        <i className="ri-delete-bin-fill" />
                                    </button>
                                </div>
                            </div>
                            <div className="gallery-admin-meta">
                                <span className="gallery-admin-name text-truncate">{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ekle / Düzenle modalı */}
            <Modal isOpen={modalOpen} toggle={closeModal} centered>
                <ModalHeader toggle={closeModal}>
                    {editingId !== null ? "Görseli düzenle" : "Yeni görsel ekle"}
                </ModalHeader>
                <ModalBody>
                    <div className="mb-3">
                        <label className="form-label fw-medium">Görsel</label>
                        <Upload
                            customRequest={customUpload}
                            listType="picture-card"
                            maxCount={1}
                            showUploadList={false}
                        >
                            {draft.url ? (
                                <img
                                    src={resolveImg(draft.url)}
                                    alt="önizleme"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : isUploading ? (
                                <Spinner size="sm" />
                            ) : (
                                <div>
                                    <i className="ri-upload-cloud-2-line fs-22 d-block mb-1" />
                                    Yükle
                                </div>
                            )}
                        </Upload>
                        <div className="form-text">Kare görseller en iyi sonucu verir.</div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="gallery-name" className="form-label fw-medium">İsim</label>
                        <Input
                            id="gallery-name"
                            value={draft.name}
                            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Örn. Yaz koleksiyonu kapağı"
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2">
                        <Button color="light" onClick={closeModal}>Vazgeç</Button>
                        <Button color="primary" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <><Spinner size="sm" className="me-1" />Kaydediliyor...</>
                            ) : (
                                <>{editingId !== null ? "Güncelle" : "Ekle"}</>
                            )}
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

            {/* Silme onayı */}
            <Modal isOpen={deleteTarget !== null} toggle={cancelDelete} centered size="sm">
                <ModalBody className="text-center py-4">
                    <i className="ri-error-warning-line display-5 text-danger" />
                    <h5 className="mt-3">Bu görseli silmek istediğinize emin misiniz?</h5>
                    <p className="text-muted fs-13">Bu işlem geri alınamaz.</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button color="light" onClick={cancelDelete}>Vazgeç</Button>
                        <Button color="danger" onClick={doDelete} disabled={isDeleting}>
                            {isDeleting ? <Spinner size="sm" /> : "Sil"}
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

            <style>{`
                .gallery-admin-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 16px;
                }
                .gallery-admin-card {
                    border-radius: 10px;
                    overflow: hidden;
                    background: var(--vz-card-bg, #fff);
                    border: 1px solid var(--vz-border-color, #e9ebec);
                    transition: box-shadow .2s ease, transform .2s ease;
                }
                .gallery-admin-card:hover {
                    box-shadow: 0 6px 18px rgba(0,0,0,.08);
                    transform: translateY(-2px);
                }
                .gallery-admin-thumb {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    background: var(--vz-light, #f3f6f9);
                    overflow: hidden;
                }
                .gallery-admin-img,
                .gallery-admin-thumb .ant-image,
                .gallery-admin-thumb .ant-image-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .gallery-admin-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity .2s ease, background .2s ease;
                }
                .gallery-admin-card:hover .gallery-admin-overlay {
                    opacity: 1;
                    background: rgba(0,0,0,.35);
                }
                .gallery-admin-action {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    border: none;
                    background: #fff;
                    color: #495057;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transform: translateY(6px);
                    transition: transform .2s ease;
                }
                .gallery-admin-card:hover .gallery-admin-action {
                    transform: translateY(0);
                }
                .gallery-admin-action--danger {
                    color: #f06548;
                }
                .gallery-admin-action:hover {
                    background: #f3f6f9;
                }
                .gallery-admin-meta {
                    padding: 8px 10px;
                    font-size: 13px;
                    color: var(--vz-body-color, #495057);
                }
            `}</style>
        </div>
    );
};