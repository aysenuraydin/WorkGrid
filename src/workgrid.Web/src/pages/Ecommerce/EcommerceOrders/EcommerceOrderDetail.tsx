import React, { useMemo, useState } from "react";
import {
  Card, CardBody, Col, Container, Row, CardHeader, Collapse,
} from "reactstrap";
import classnames from "classnames";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import config from "config";

import { useGridbaseById, useGridbaseAll } from "hooks/useGridBase";
import { IOrder, IProduct, IProductVariant, IInvoice } from "common/data/ecommerce";
import { ORDER_TABLE, ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE, INVOICE_TABLE } from "common/data/constans";
import { useGetCommerce } from "hooks/useCommerce";
import useThemeMode from "hooks/useThemeMode";


const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const STATUS_FLOW = ["pending", "inprogress", "pickups", "delivered"] as const;
const STATUS_STEPS: { key: string; label: string; icon: string }[] = [
  { key: "pending",    label: "Sipariş Alındı", icon: "ri-shopping-bag-line" },
  { key: "inprogress", label: "Hazırlanıyor",   icon: "mdi mdi-gift-outline" },
  { key: "pickups",    label: "Kargoya Verildi", icon: "ri-truck-line" },
  { key: "delivered",  label: "Teslim Edildi",  icon: "mdi mdi-package-variant" },
];

const PAYMENT_LABEL: Record<string, string> = {
  card: "Kredi / Banka Kartı",
  paypal: "PayPal",
  cod: "Kapıda Ödeme",
};

interface IParsedItem {
  productId?: number;
  variantId?: number;
  name?: string;
  combination?: string;
  unitPrice?: number;
  discountedUnitPrice?: number;
  quantity?: number;
  lineTotal?: number;
}

interface IParsedAddress {
  fullName?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  zipCode?: string;
  label?: string;
}

const safeParse = <T,>(raw?: string | null, fallback: T = [] as any): T => {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

const EcommerceOrderDetail = () => {
  const { id } = useParams();
  const orderId = Number(id);

  const { data } = useGetCommerce();
  const { data: brand } = useGetBrand();
  const { isDark } = useThemeMode(); 
  document.title = "Sipariş Detayı | " + (brand?.companyName || "Workgrid");

  const { data: order, isLoading } = useGridbaseById<IOrder>(ORDER_TABLE, orderId);
  const { data: products } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const { data: invoices } = useGridbaseAll<IInvoice>(INVOICE_TABLE);

  const [col1, setCol1] = useState(true);
  const [col2, setCol2] = useState(true);
  const [col3, setCol3] = useState(true);

  const items = useMemo<IParsedItem[]>(() => safeParse<IParsedItem[]>(order?.items, []), [order]);
  const shipAddr = useMemo<IParsedAddress>(() => safeParse<IParsedAddress>(order?.shippingAddress, {}), [order]);
  const invoice = useMemo(
    () => (invoices ?? []).find((inv) => Number(inv.wGOrderId) === orderId) ?? null,
    [invoices, orderId]
  );

  const imageFor = (item: IParsedItem) => {
    const variant = (variants ?? []).find((v) => v.id === item.variantId);
    if (variant?.variantImage) return resolveImg(variant.variantImage);
    const product = (products ?? []).find((p) => p.id === item.productId);
    return resolveImg(product?.mainImage);
  };

  const currentIndex = order ? STATUS_FLOW.indexOf(order.status as any) : -1;
  const isCancelled = order?.status === "cancelled";
  const isReturned = order?.status === "returns";
  const stepDone = (stepKey: string) => {
    const idx = STATUS_FLOW.indexOf(stepKey as any);
    return idx >= 0 && currentIndex >= idx;
  };

  const tax = order ? Math.round((order.subTotal - order.discount) * 0.125 * 100) / 100 : 0;

  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  if (!order) {
    return (
      <div className="page-content"><Container fluid>
        <div className="py-5 text-center">
          <i className="ri-error-warning-line display-5 text-muted" />
          <h5 className="mt-3">Sipariş bulunamadı</h5>
          <Link to="/orders" className="btn btn-primary mt-2">Siparişlerime Dön</Link>
        </div>
      </Container></div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Sipariş Detayları" pageTitle={brand?.companyName || "Workgrid"} />

        <Row>
          <Col xl={9}>
            <Card className="border border-2">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">Order {order.orderNo}</h5>
                  <div className="flex-shrink-0">
                    {invoice ? (
                      <Link to={`/invoice-detail/${invoice.id}`} className="btn btn-primary btn-sm">
                        <i className="ri-download-2-fill align-middle me-1"></i> Invoice
                      </Link>
                    ) : (
                      <span className="badge bg-light text-muted">Fatura yok</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="table-responsive table-card">
                  <table className="table table-nowrap align-middle table-borderless mb-0">
                    <thead className={`table-${isDark?'dark':'light'} text-muted`}>
                      <tr>
                        <th className={`text-${isDark?'light':"dark"}`} scope="col">Product Details</th>
                        <th className={`text-${isDark?'light':"dark"}`} scope="col">Item Price</th>
                        <th className={`text-${isDark?'light':"dark"}`} scope="col">Quantity</th>
                        <th className={`text-end text-${isDark?'light':"dark"}`} scope="col">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, key) => (
                        <tr key={key}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-md bg-light rounded p-1">
                                <img
                                  src={imageFor(item)}
                                  alt=""
                                  className="img-fluid d-block"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                                    e.currentTarget.onerror = null;
                                  }}
                                />
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h5 className="fs-15">
                                  {item.productId ? (
                                    <Link to={`/product-detail/${item.productId}`} className="link-primary">
                                      {item.name ?? "Ürün"}
                                    </Link>
                                  ) : (item.name ?? "Ürün")}
                                </h5>
                                {item.combination && (
                                  <p className="text-muted mb-0">
                                    Varyant: <span className="fw-medium">{item.combination}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{data?.currencyCode}{Number(item.discountedUnitPrice ?? item.unitPrice ?? 0)}</td>
                          <td>{item.quantity ?? 1}</td>
                          <td className="fw-medium text-end">
                            {data?.currencyCode}{Number(item.lineTotal ?? 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}

                      <tr className="border-top border-top-dashed">
                        <td colSpan={2}></td>
                        <td colSpan={2} className="fw-medium p-0">
                          <table className="table table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td>Sub Total :</td>
                                <td className="text-end">{data?.currencyCode}{Number(order.subTotal).toFixed(2)}</td>
                              </tr>
                              {Number(order.discount) > 0 && (
                                <tr>
                                  <td>
                                    Discount{" "}
                                    {order.couponCode && <span className="text-muted">({order.couponCode})</span>} :
                                  </td>
                                  <td className="text-end">-{data?.currencyCode}{Number(order.discount).toFixed(2)}</td>
                                </tr>
                              )}
                              <tr>
                                <td>Shipping Charge :</td>
                                <td className="text-end">{data?.currencyCode}{Number(order.shippingCharge).toFixed(2)}</td>
                              </tr>
                              <tr>
                                <td>Estimated Tax :</td>
                                <td className="text-end">{data?.currencyCode}{tax.toFixed(2)}</td>
                              </tr>
                              <tr className="border-top border-top-dashed">
                                <th scope="row">Total (USD) :</th>
                                <th className="text-end">{data?.currencyCode}{Number(order.total).toFixed(2)}</th>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

            {/* ── Order Status (dinamik) ── */}
            <Card className="border border-2">
              <CardHeader>
                <div className="d-sm-flex align-items-center">
                  <h5 className="card-title flex-grow-1 mb-0">Order Status</h5>
                  <div className="flex-shrink-0 mt-2 mt-sm-0">
                    <span className={`badge bg-${
                      isCancelled ? "danger" : isReturned ? "primary" : "success"
                    }-subtle text-${
                      isCancelled ? "danger" : isReturned ? "primary" : "success"
                    } fs-12`}>
                      {isCancelled ? "İptal Edildi" : isReturned ? "İade" :
                        (STATUS_STEPS.find(s => s.key === order.status)?.label ?? order.status)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                {isCancelled ? (
                  <div className="text-center py-4">
                    <i className="ri-close-circle-line display-5 text-danger" />
                    <h6 className="mt-3 mb-1">Bu sipariş iptal edildi.</h6>
                    <p className="text-muted mb-0">
                      {moment(order.orderDate).format("DD MMM YYYY, HH:mm")}
                    </p>
                  </div>
                ) : (
                  <div className="profile-timeline">
                    <div className="accordion accordion-flush">

                      {/* Adım 1 — Sipariş Alındı */}
                      <div className="accordion-item border-0" onClick={() => setCol1(!col1)}>
                        <div className="accordion-header">
                          <Link to="#" className={classnames("accordion-button", "p-2", "shadow-none", { collapsed: !col1 })}>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className={`avatar-title rounded-circle ${stepDone("pending") ? "bg-primary" : "bg-light text-primary"}`}>
                                  <i className="ri-shopping-bag-line"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-15 mb-0 fw-semibold">
                                  Sipariş Alındı -{" "}
                                  <span className="fw-normal">{moment(order.orderDate).format("ddd, DD MMM YYYY")}</span>
                                </h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Collapse className="accordion-collapse" isOpen={col1}>
                          <div className="accordion-body ms-2 ps-5 pt-0">
                            <h6 className="mb-1">Siparişiniz oluşturuldu.</h6>
                            <p className="text-muted mb-0">{moment(order.orderDate).format("ddd, DD MMM YYYY - HH:mm")}</p>
                          </div>
                        </Collapse>
                      </div>

                      {/* Adım 2 — Hazırlanıyor */}
                      <div className="accordion-item border-0" onClick={() => setCol2(!col2)}>
                        <div className="accordion-header">
                          <Link to="#" className={classnames("accordion-button", "p-2", "shadow-none", { collapsed: !col2 })}>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className={`avatar-title rounded-circle ${stepDone("inprogress") ? "bg-primary" : "bg-light text-primary"}`}>
                                  <i className="mdi mdi-gift-outline"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-15 mb-1 fw-semibold">Hazırlanıyor</h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Collapse className="accordion-collapse" isOpen={col2}>
                          <div className="accordion-body ms-2 ps-5 pt-0">
                            <h6 className="mb-1">
                              {stepDone("inprogress")
                                ? "Siparişiniz hazırlanıyor."
                                : "Bu adım henüz başlamadı."}
                            </h6>
                          </div>
                        </Collapse>
                      </div>

                      {/* Adım 3 — Kargoya Verildi */}
                      <div className="accordion-item border-0" onClick={() => setCol3(!col3)}>
                        <div className="accordion-header">
                          <Link to="#" className={classnames("accordion-button", "p-2", "shadow-none", { collapsed: !col3 })}>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className={`avatar-title rounded-circle ${stepDone("pickups") ? "bg-primary" : "bg-light text-primary"}`}>
                                  <i className="ri-truck-line"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-15 mb-1 fw-semibold">Kargoya Verildi</h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                        <Collapse className="accordion-collapse" isOpen={col3}>
                          <div className="accordion-body ms-2 ps-5 pt-0">
                            <h6 className="mb-1">
                              {stepDone("pickups")
                                ? "Siparişiniz kargoya teslim edildi."
                                : "Bu adım henüz başlamadı."}
                            </h6>
                          </div>
                        </Collapse>
                      </div>

                      {/* Adım 4 — Teslim Edildi */}
                      <div className="accordion-item border-0">
                        <div className="accordion-header">
                          <Link to="#" className="accordion-button p-2 shadow-none">
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs">
                                <div className={`avatar-title rounded-circle ${stepDone("delivered") ? "bg-primary" : "bg-light text-primary"}`}>
                                  <i className="mdi mdi-package-variant"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="fs-14 mb-0 fw-semibold">Teslim Edildi</h6>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>

          {/* ── Sağ kolon ── */}
          <Col xl={3}>
            {/* Logistics */}
            <Card className="border border-2">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-truck-fast-outline align-middle me-1 text-muted"></i> Logistics Details
                </h5>
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <i className="mdi mdi-truck-fast-outline display-6 text-muted"></i>
                  <h5 className="fs-16 mt-2">Sipariş No</h5>
                  <p className="text-muted mb-0 font-monospace">{order.orderNo}</p>
                  <p className="text-muted mb-0">Ödeme: {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}</p>
                </div>
              </CardBody>
            </Card>

            {/* Shipping Address (parse edilmiş) */}
            <Card className="border border-2">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-map-pin-line align-middle me-1 text-muted"></i> Shipping Address
                </h5>
              </CardHeader>
              <CardBody>
                {shipAddr.fullName ? (
                  <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                    <li className="fw-medium fs-14">{shipAddr.fullName}</li>
                    {shipAddr.phone && <li>{shipAddr.phone}</li>}
                    {shipAddr.address && <li>{shipAddr.address}</li>}
                    <li>{[shipAddr.state, shipAddr.zipCode].filter(Boolean).join(" - ")}</li>
                    {shipAddr.country && <li>{shipAddr.country}</li>}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">Adres bilgisi yok.</p>
                )}
              </CardBody>
            </Card>

            {/* Billing (invoice varsa) */}
            {invoice && (
              <Card className="border border-2">
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="ri-map-pin-line align-middle me-1 text-muted"></i> Billing Address
                  </h5>
                </CardHeader>
                <CardBody>
                  <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                    <li className="fw-medium fs-14">{invoice.firstName} {invoice.lastName}</li>
                    {invoice.phone && <li>{invoice.phone}</li>}
                    {invoice.email && <li>{invoice.email}</li>}
                    {invoice.address && <li>{invoice.address}</li>}
                    <li>{[invoice.state, invoice.zipCode].filter(Boolean).join(" - ")}</li>
                    {invoice.country && <li>{invoice.country}</li>}
                  </ul>
                </CardBody>
              </Card>
            )}

            {/* Payment Details */}
            <Card className="border border-2">
              <CardHeader>
                <h5 className="card-title mb-0">
                  <i className="ri-secure-payment-line align-bottom me-1 text-muted"></i> Payment Details
                </h5>
              </CardHeader>
              <CardBody>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0"><p className="text-muted mb-0">Sipariş No:</p></div>
                  <div className="flex-grow-1 ms-2"><h6 className="mb-0 font-monospace">{order.orderNo}</h6></div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="flex-shrink-0"><p className="text-muted mb-0">Ödeme Yöntemi:</p></div>
                  <div className="flex-grow-1 ms-2"><h6 className="mb-0">{PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}</h6></div>
                </div>
                {order.couponCode && (
                  <div className="d-flex align-items-center mb-2">
                    <div className="flex-shrink-0"><p className="text-muted mb-0">Kupon:</p></div>
                    <div className="flex-grow-1 ms-2"><h6 className="mb-0">{order.couponCode}</h6></div>
                  </div>
                )}
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0"><p className="text-muted mb-0">Toplam Tutar:</p></div>
                  <div className="flex-grow-1 ms-2"><h6 className="mb-0">{data?.currencyCode}{Number(order.total).toFixed(2)}</h6></div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceOrderDetail;