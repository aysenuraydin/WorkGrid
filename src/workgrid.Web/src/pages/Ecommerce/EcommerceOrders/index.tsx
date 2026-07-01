import React, { useMemo, useState } from "react";
import {
  Card, CardBody, Col, Container, CardHeader,
  Nav, NavItem, NavLink, Row,
  Modal, ModalHeader, ModalBody, Label, Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

import ExportCSVModal from "components/Common/ExportCSVModal";
import DeleteModal from "components/Common/DeleteModal";
import BreadCrumb from "components/Common/BreadCrumb";
import TableContainer from "components/Common/TableContainer";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import { useGetRoleUsersAll } from "hooks/useRole";
import config from "config";

import { useGridbaseAll, usePatchRow, useDeleteRow } from "hooks/useGridBase";
import Widget from "../Widgets";
import { IOrder, IInvoice, IProduct } from "common/data/ecommerce";
import { ORDER_TABLE, INVOICE_TABLE, ECOMMERCE_TABLE } from "common/data/constans";
import { OrderProductsCell } from "./OrderProductsCell";
import { useGetCommerce } from "hooks/useCommerce";
import useThemeMode from "hooks/useThemeMode";


export const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/100x100/F3F6F9/969696.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const initials = (firstName?: string, lastName?: string) => {
  const f = (firstName ?? "").charAt(0);
  const l = (lastName ?? "").charAt(0);
  return (f + l).toUpperCase() || "?";
};

const STATUS_META: Record<string, { label: string; badge: string }> = {
  pending:    { label: "Pending",     badge: "warning" },
  inprogress: { label: "Inprogress",  badge: "secondary" },
  pickups:    { label: "Pickups",     badge: "info" },
  delivered:  { label: "Delivered",   badge: "success" },
  returns:    { label: "Returns",     badge: "primary" },
  cancelled:  { label: "Cancelled",   badge: "danger" },
};

const STATUS_OPTIONS = Object.keys(STATUS_META);

const PAYMENT_LABEL: Record<string, string> = {
  card: "Kart",
  paypal: "PayPal",
  cod: "Kapıda Ödeme",
};

const TABS: { id: string; label: string; icon: string; status: string | null }[] = [
  { id: "all",        label: "All Orders", icon: "ri-store-2-fill",          status: null },
  { id: "delivered",  label: "Delivered",  icon: "ri-checkbox-circle-line",  status: "delivered" },
  { id: "pickups",    label: "Pickups",    icon: "ri-truck-line",            status: "pickups" },
  { id: "inprogress", label: "Inprogress", icon: "ri-loader-2-line",         status: "inprogress" },
  { id: "returns",    label: "Returns",    icon: "ri-arrow-left-right-fill", status: "returns" },
  { id: "cancelled",  label: "Cancelled",  icon: "ri-close-circle-line",     status: "cancelled" },
];

export interface IParsedItem {
  productId?: number;
  variantId?: number;
  name?: string;
  combination?: string;
  quantity?: number;
}

const safeParseItems = (raw?: string): IParsedItem[] => {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
};

const EcommerceOrders = () => {
  const { data: brand } = useGetBrand();
  document.title = "Orders | " + (brand?.companyName || "Workgrid");

  const [activeTab, setActiveTab] = useState("all");

  const activeStatus = useMemo(
    () => TABS.find((t) => t.id === activeTab)?.status ?? null,
    [activeTab]
  );

  // Tüm siparişleri çek, client'ta filtrele
  const { data: allOrders, isLoading } = useGridbaseAll<IOrder>(ORDER_TABLE, {
    sort: "orderDate:desc",
  });
  const { data: invoices } = useGridbaseAll<IInvoice>(INVOICE_TABLE);
  const { data: products } = useGridbaseAll<Pick<IProduct, "id" | "name" | "mainImage">>(
    ECOMMERCE_TABLE,
    { select: "name,mainImage" }
  );
  const { data: users } = useGetRoleUsersAll();
  const { isDark } = useThemeMode();  
  const { data } = useGetCommerce();

  const orders = useMemo(() => {
    if (!activeStatus) return allOrders ?? [];
    return (allOrders ?? []).filter((o) => o.status === activeStatus);
  }, [allOrders, activeStatus]);

  const patchOrder = usePatchRow(ORDER_TABLE);
  const delOrder = useDeleteRow(ORDER_TABLE);

  // orderId -> invoice
  const invoiceByOrderId = useMemo(() => {
    const map: Record<number, IInvoice> = {};
    (invoices ?? []).forEach((inv) => { map[Number(inv.wGOrderId)] = inv; });
    return map;
  }, [invoices]);

  // productId -> product (görsel için)
  type ProductLite = Pick<IProduct, "id" | "name" | "mainImage">;

  const productById = useMemo(() => {
    const map: Record<number, ProductLite> = {};
    (products ?? []).forEach((p) => { map[Number(p.id)] = p; });
    return map;
  }, [products]);

  // userId -> user (resim + ad soyad için)
  const userById = useMemo(() => {
    const map: Record<string, any> = {};
    (users ?? []).forEach((u: any) => { map[String(u.id)] = u; });
    return map;
  }, [users]);

  // ── Status düzenleme modalı ──
  const [statusModal, setStatusModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [newStatus, setNewStatus] = useState<string>("pending");

  const openStatusModal = (order: IOrder) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setStatusModal(true);
  };

  const saveStatus = () => {
    if (!editingOrder) return;
    patchOrder.mutate(
      { id: editingOrder.id, payload: { status: newStatus } } as any,
      {
        onSuccess: () => { toast.success("Sipariş durumu güncellendi."); setStatusModal(false); },
        onError: () => toast.error("Durum güncellenemedi."),
      }
    );
  };

  // ── Silme modalı ──
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<IOrder | null>(null);

  const openDeleteModal = (order: IOrder) => {
    setDeletingOrder(order);
    setDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deletingOrder) return;
    delOrder.mutate(deletingOrder.id, {
      onSuccess: () => { toast.success("Sipariş silindi."); setDeleteModal(false); },
      onError: () => toast.error("Sipariş silinemedi."),
    });
  };

  // ── Export ──
  const [isExportCSV, setIsExportCSV] = useState(false);

  // ── Kolonlar ──
  const columns = useMemo(
    () => [
      {
        header: "Order No",
        accessorKey: "orderNo",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <Link to={`/order-details/${cell.row.original.id}`} className="fw-medium text-primary">
            {cell.getValue()}
          </Link>
        ),
      },
      {
        header: "Ürünler",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell: any) => {
          const order: IOrder = cell.row.original;
          const items = safeParseItems(order.items);
          return <OrderProductsCell items={items} productById={productById} />;
        },
      },
      {
        header: "Müşteri",
        accessorKey: "userId",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const uid = cell.getValue();
          const user = uid ? userById[String(uid)] : undefined;

          if (!user) {
            return <span className="text-muted">{uid ?? "—"}</span>;
          }

          return (
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-xs rounded-circle flex-shrink-0">
                {user.profilePictureUrl ? (
                  <img
                    src={`${config.api.FILE_API_URL}/File/${user.profilePictureUrl}`}
                    alt=""
                    className="img-fluid rounded-circle"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="avatar-title rounded-circle bg-light text-primary fs-12">
                    {initials(user.firstName, user.lastName)}
                  </div>
                )}
              </div>
              <Link to={"/profile/"+user.id}>
                <span className="text-truncate text-primary" style={{ maxWidth: 140 }}>
                  {user.firstName} {user.lastName}
                </span>
              </Link>
            </div>
          );
        },
      },
      {
        header: "Tarih",
        accessorKey: "orderDate",
        enableColumnFilter: false,
        cell: (cell: any) => (
          <>
            {moment(cell.getValue()).format("DD MMM YYYY")},
            <small className="text-muted"> {moment(cell.getValue()).format("HH:mm")}</small>
          </>
        ),
      },
      {
        header: "Tutar",
        accessorKey: "total",
        enableColumnFilter: false,
        cell: (cell: any) => <>{data?.currencyCode}{Number(cell.getValue()).toFixed(2)}</>,
      },
      {
        header: "Ödeme",
        accessorKey: "paymentMethod",
        enableColumnFilter: false,
        cell: (cell: any) => PAYMENT_LABEL[cell.getValue()] ?? cell.getValue(),
      },
      {
        header: "Durum",
        accessorKey: "status",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const meta = STATUS_META[cell.getValue()] ?? { label: cell.getValue(), badge: "secondary" };
          return (
            <span className={`badge text-uppercase bg-${meta.badge}-subtle text-${meta.badge}`}>
              {meta.label}
            </span>
          );
        },
      },
      {
        header: "İşlem",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps: any) => {
          const order: IOrder = cellProps.row.original;
          const invoice = invoiceByOrderId[Number(order.id)];
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <Link to={`/order-details/${order.id}`} className="text-primary d-inline-block" title="Detay">
                  <i className="ri-eye-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  to={invoice ? `/invoice-details/${order.id}` : "#"}
                  className={`text-${invoice ? "success" : "secondary"} d-inline-block`}
                  title="Fatura"
                >
                  <i className="ri-bill-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="#" className="text-warning d-inline-block" title="Durum Değiştir"
                  onClick={(e) => { e.preventDefault(); openStatusModal(order); }}>
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="#" className="text-danger d-inline-block" title="Sil"
                  onClick={(e) => { e.preventDefault(); openDeleteModal(order); }}>
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [invoiceByOrderId, productById, userById]
  );

  return (
    <div className="page-content">
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={orders ?? []}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={confirmDelete}
        onCloseClick={() => setDeleteModal(false)}
      />

      <Container fluid>
        <BreadCrumb title="Siparişler" pageTitle={brand?.companyName || "Workgrid"} />
        <Row>
          <Col lg={12}>
          <Widget />
            <Card id="orderList" className="border border-2">
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Sipariş Geçmişi</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <button type="button" className="btn btn-success" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-upload-line align-bottom me-1"></i> Export
                      </button>
                    </div>
                  </div>
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  <Nav className="nav-tabs nav-tabs-custom nav-success" role="tablist">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <NavItem key={tab.id}>
                          <NavLink
                            className={classnames({ 
                              active: isActive, 
                              "text-primary": isActive 
                            })}
                            onClick={(e) => {
                              e.preventDefault();  
                              setActiveTab(tab.id);
                            }}
                            href="#"
                            style={{ 
                              cursor: "pointer",
                              color: isActive ? "var(--vz-primary)" : "inherit",
                              fontWeight: isActive ? "600" : "normal"
                            }}
                          >
                            <i className={`${tab.icon} me-1 align-bottom ${isActive ? "text-primary" : ""}`}></i> 
                            {tab.label}
                          </NavLink>
                        </NavItem>
                      );
                    })}
                  </Nav>

                  {isLoading ? (
                    <Loader />
                  ) : (orders && orders.length) ? (
                    <TableContainer
                      columns={columns}
                      data={orders || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      divClass="table-responsive table-card mb-1 pt-0"
                      tableClass="align-middle table-nowrap"
                      SearchPlaceholder="Sipariş no, müşteri veya durum ara..."
                      
                      theadClass={`table-${isDark ? 'dark':'light'} text-muted text-uppercase`}
                      thClass={`${isDark ? 'text-light':'text-dark'}`}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <i className="ri-inbox-line display-5 text-muted" />
                      <h5 className="mt-3">Sipariş bulunamadı</h5>
                    </div>
                  )}
                </div>

                <ToastContainer closeButton={true} limit={3} style={{ marginTop: "100px" }} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ── Status Düzenleme Modalı ── */}
      <Modal isOpen={statusModal} toggle={() => setStatusModal(!statusModal)} centered>
        <ModalHeader className="bg-light p-3" toggle={() => setStatusModal(!statusModal)}>
          Sipariş Durumu
        </ModalHeader>
        <ModalBody>
          {editingOrder && (
            <>
              <p className="text-muted mb-3">
                <span className="font-monospace fw-medium">{editingOrder.orderNo}</span> numaralı siparişin durumunu değiştir.
              </p>
              <Label htmlFor="status-select" className="form-label">Durum</Label>
              <Input
                id="status-select"
                type="select"
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </Input>
            </>
          )}
        </ModalBody>
        <div className="modal-footer">
          <div className="hstack gap-2 justify-content-end">
            <button type="button" className="btn btn-light" onClick={() => setStatusModal(false)}>
              Vazgeç
            </button>
            <button type="button" className="btn btn-success" onClick={saveStatus} disabled={patchOrder.isPending}>
              {patchOrder.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EcommerceOrders;