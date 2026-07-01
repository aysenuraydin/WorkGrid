import React, { useMemo, useState } from "react";
import {
  Container, Row, Col, Card, CardBody, CardHeader,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Label, Input, Badge,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import BreadCrumb from "components/Common/BreadCrumb";
import { useGetBrand } from "hooks/useBrand";
import { useGridbaseAll, useCreateRow, useUpdateRow, useDeleteRow } from "hooks/useGridBase";
import { COUPON_TABLE } from "common/data/constans";  
import { ICoupon } from "common/data/ecommerce";
import { useGetCommerce } from "hooks/useCommerce";
import useThemeMode from "hooks/useThemeMode";

const EMPTY_FORM = {
    code: "",
    discountType: "percent" as "percent" | "fixed",
    discountValue: "",
    minAmount: "",
    expiresAt: "",
    isActive: true,
};

const EcommerceCoupons = () => {
    const { data: brand } = useGetBrand();
    const { isDark } = useThemeMode();  
    document.title = "Coupons | " + (brand?.companyName || "Workgrid");

    const { data: coupons, isLoading } = useGridbaseAll<ICoupon>(COUPON_TABLE);
    const createCoupon = useCreateRow(COUPON_TABLE);
    const updateCoupon = useUpdateRow(COUPON_TABLE);
    const deleteCoupon = useDeleteRow(COUPON_TABLE);

    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editing, setEditing] = useState<ICoupon | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() =>
        (coupons ?? []).filter((c) =>
        c.code.toLowerCase().includes(search.toLowerCase())
        ), [coupons, search]);

    const openAdd = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setModal(true);
    };

    const openEdit = (c: ICoupon) => {
        setEditing(c);
        setForm({
        code: c.code,
        discountType: c.discountType as "percent" | "fixed",
        discountValue: String(c.discountValue),
        minAmount: c.minAmount != null ? String(c.minAmount) : "",
        expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
        isActive: c.isActive,
        });
        setModal(true);
    };

    const save = () => {
        if (!form.code.trim()) { toast.error("Kupon kodu zorunludur."); return; }
        if (!form.discountValue || isNaN(Number(form.discountValue))) {
        toast.error("Geçerli bir indirim değeri girin."); return;
        }

        const payload: Omit<ICoupon, "id"> = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minAmount: form.minAmount ? Number(form.minAmount) : null,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
        };

        if (editing) {
        updateCoupon.mutate({ id: editing.id, payload }, {
            onSuccess: () => { toast.success("Kupon güncellendi."); setModal(false); },
            onError: () => toast.error("Güncelleme başarısız."),
        });
        } else {
        createCoupon.mutate(payload as any, {
            onSuccess: () => { toast.success("Kupon eklendi."); setModal(false); },
            onError: () => toast.error("Ekleme başarısız."),
        });
        }
    };

    const { data } = useGetCommerce();

    const confirmDelete = () => {
        if (!deletingId) return;
        deleteCoupon.mutate(deletingId, {
        onSuccess: () => { toast.success("Kupon silindi."); setDeleteModal(false); },
        onError: () => toast.error("Silme başarısız."),
        });
    };

    const isExpired = (expiresAt: string | null) =>
        expiresAt ? new Date(expiresAt) < new Date() : false;

    return (
        <React.Fragment>
        <div className="page-content">
            <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
            <Container fluid>
            <BreadCrumb title="Kupon Yönetimi" pageTitle={brand?.companyName || "Workgrid"} />

            <Row>
                <Col xs={12}>
                <Card className="border border-2">
                    <CardHeader>
                    <Row className="align-items-center gy-2">
                        <Col sm>
                        <h5 className="card-title mb-0">Kupon Listesi</h5>
                        </Col>
                        <Col sm="auto" className="d-flex gap-2">
                        <Input
                            type="text"
                            placeholder="Kupon ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: 200 }}
                        />
                        <button className="btn btn-primary" onClick={openAdd}>
                            <i className="ri-add-line me-1"></i> Yeni Kupon Ekle
                        </button>
                        </Col>
                    </Row>
                    </CardHeader>
                    <CardBody className="p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-borderless align-middle mb-0">
                        <thead className={`table-${isDark?"dark":"light"} text-muted`}>
                            <tr>
                            <th className={`${isDark?"text-light":""}`}>Kupon Kodu</th>
                            <th className={`${isDark?"text-light":""}`}>Tür</th>
                            <th className={`${isDark?"text-light":""}`}>Değer</th>
                            <th className={`${isDark?"text-light":""}`}>Min. Sepet Tutarı</th>
                            <th className={`${isDark?"text-light":""}`}>Son Kullanma Tarihi</th>
                            <th className={`${isDark?"text-light":""}`}>Durum</th>
                            <th className={`text-end ${isDark?"text-light":""}`}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                            <tr><td colSpan={7} className="text-center py-4 text-muted">Yükleniyor...</td></tr>
                            )}
                            {!isLoading && filtered.length == 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-5 text-muted">
                                <i className="ri-coupon-3-line display-5 d-block mb-2"></i>
                                Henüz bir kupon oluşturulmamış.{" "}
                                <span className="text-primary" style={{ cursor: "pointer" }} onClick={openAdd}>
                                    İlk kuponunu ekle
                                </span>
                                </td>
                            </tr>
                            )}
                            {filtered.map((c) => {
                            const expired = isExpired(c.expiresAt);
                            return (
                                <tr key={c.id}>
                                <td>
                                    <span className="fw-semibold font-monospace fs-13">{c.code}</span>
                                </td>
                                <td>
                                    <Badge color={c.discountType == "percent" ? "info" : "warning"} className="fs-11">
                                    {c.discountType == "percent" ? "Yüzdesel" : "Sabit Tutar"}
                                    </Badge>
                                </td>
                                <td>
                                    {c.discountType == "percent"
                                    ? `%${c.discountValue}`
                                    : `${c.discountValue} ${data?.currencyCode}`}
                                </td>
                                <td>
                                    {c.minAmount != null ? `${c.minAmount} ${data?.currencyCode}` : <span className="text-muted">—</span>}
                                </td>
                                <td>
                                    {c.expiresAt ? (
                                    <span className={expired ? "text-danger" : "text-muted"}>
                                        {new Date(c.expiresAt).toLocaleDateString()}
                                        {expired && <i className="ri-time-line ms-1"></i>}
                                    </span>
                                    ) : (
                                    <span className="text-muted">Süresiz</span>
                                    )}
                                </td>
                                <td>
                                    {!c.isActive || expired ? (
                                    <Badge color="danger" className="fs-11">Pasif</Badge>
                                    ) : (
                                    <Badge color="success" className="fs-11">Aktif</Badge>
                                    )}
                                </td>
                                <td className="text-end">
                                    <button className="btn btn-sm btn-ghost-secondary me-1" onClick={() => openEdit(c)}>
                                    <i className="ri-pencil-fill"></i>
                                    </button>
                                    <button className="btn btn-sm btn-ghost-danger" onClick={() => {
                                    setDeletingId(c.id);
                                    setDeleteModal(true);
                                    }}>
                                    <i className="ri-delete-bin-fill"></i>
                                    </button>
                                </td>
                                </tr>
                            );
                            })}
                        </tbody>
                        </table>
                    </div>
                    </CardBody>
                </Card>
                </Col>
            </Row>
            </Container>
        </div>

        {/* ── Add / Edit Modal ── */}
        <Modal isOpen={modal} toggle={() => setModal(!modal)} centered>
            <ModalHeader toggle={() => setModal(!modal)}>
            {editing ? "Kuponu Düzenle" : "Yeni Kupon Ekle"}
            </ModalHeader>
            <ModalBody>
            <Row className="gy-3">
                <Col xs={12}>
                <Label className="form-label">Kupon Kodu <span className="text-danger">*</span></Label>
                <Input
                    type="text"
                    placeholder="örn: YAZ2026"
                    value={form.code}
                    onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                />
                </Col>

                <Col sm={6}>
                <Label className="form-label">İndirim Türü <span className="text-danger">*</span></Label>
                <select className="form-select" value={form.discountType}
                    onChange={(e) => setForm(p => ({ ...p, discountType: e.target.value as "percent" | "fixed" }))}>
                    <option value="percent">Yüzdesel (%)</option>
                    <option value="fixed">Sabit Tutar ({data?.currencyCode})</option>
                </select>
                </Col>

                <Col sm={6}>
                <Label className="form-label">İndirim Değeri <span className="text-danger">*</span></Label>
                <Input
                    type="number"
                    min={0}
                    placeholder="örn: 10"
                    value={form.discountValue}
                    onChange={(e) => setForm(p => ({ ...p, discountValue: e.target.value }))}
                />
                </Col>

                <Col sm={6}>
                <Label className="form-label">Min. Sepet Tutarı</Label>
                <Input
                    type="number"
                    min={0}
                    placeholder="Opsiyonel"
                    value={form.minAmount}
                    onChange={(e) => setForm(p => ({ ...p, minAmount: e.target.value }))}
                />
                </Col>

                <Col sm={6}>
                <Label className="form-label">Son Kullanma Tarihi</Label>
                <Input
                    type="date"
                    value={form.expiresAt}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                />
                </Col>

                <Col xs={12}>
                <div className="form-check form-switch">
                    <input
                    type="checkbox"
                    className="form-check-input"
                    id="coupon-isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm(p => ({ ...p, isActive: e.target.checked }))}
                    />
                    <Label className="form-check-label" htmlFor="coupon-isActive">
                    Bu kupon şu an aktif mi?
                    </Label>
                </div>
                </Col>
            </Row>
            </ModalBody>
            <ModalFooter>
            <button className="btn btn-light" onClick={() => setModal(false)}>İptal</button>
            <button className="btn btn-success" onClick={save}
                disabled={createCoupon.isPending || updateCoupon.isPending}>
                <i className="ri-save-3-fill me-1"></i>
                {editing ? "Güncelle" : "Kaydet"}
            </button>
            </ModalFooter>
        </Modal>

        {/* ── Delete Modal ── */}
        <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)} centered>
            <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Kupon Silme</ModalHeader>
            <ModalBody>
            <div className="mt-2 text-center">
                <i className="ri-delete-bin-5-line display-5 text-danger"></i>
                <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Emin misiniz?</h4>
                <p className="text-muted mx-4 mb-0">Bu kupon kalıcı olarak silinecektir. Bu işlem geri alınamaz.</p>
                </div>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                <button className="btn w-sm btn-light" onClick={() => setDeleteModal(false)}>İptal</button>
                <button className="btn w-sm btn-danger" onClick={confirmDelete}
                disabled={deleteCoupon.isPending}>
                Evet, Sil!
                </button>
            </div>
            </ModalBody>
        </Modal>
        </React.Fragment>
    );
};

export default EcommerceCoupons;