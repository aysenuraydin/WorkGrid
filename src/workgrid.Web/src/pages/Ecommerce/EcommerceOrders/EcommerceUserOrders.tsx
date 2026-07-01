import React, { useMemo, useState } from "react";
import {
  Card, CardBody, Col, Container, Row, Collapse, Badge,
} from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";
import moment from "moment";

import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import { useAuth } from "context/AuthContext";
import config from "config";

import { useGridbaseAll } from "hooks/useGridBase";
import { IOrder, IProduct, IProductVariant } from "common/data/ecommerce";
import { ORDER_TABLE, ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE } from "common/data/constans";
import { useGetCommerce } from "hooks/useCommerce";

const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

// status -> görsel karşılık
const STATUS_MAP: Record<string, { label: string; class: string; icon: string }> = {
  pending:    { label: "Beklemede",   class: "warning",   icon: "ri-time-line" },
  inprogress: { label: "Hazırlanıyor", class: "secondary", icon: "ri-loader-2-line" },
  pickups:    { label: "Kargoda",     class: "info",      icon: "ri-truck-line" },
  delivered:  { label: "Teslim Edildi", class: "success", icon: "ri-checkbox-circle-line" },
  returns:    { label: "İade",        class: "primary",   icon: "ri-arrow-go-back-line" },
  cancelled:  { label: "İptal Edildi", class: "danger",   icon: "ri-close-circle-line" },
};

const statusInfo = (status: string) =>
  STATUS_MAP[status] ?? { label: status ?? "—", class: "secondary", icon: "ri-information-line" };

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

const safeParseItems = (raw?: string): IParsedItem[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const EcommerceUserOrders = () => {
  const { data: brand } = useGetBrand();
  document.title = "Siparişlerim | " + (brand?.companyName || "Workgrid");

  const { user: usr } = useAuth();
  const { data } = useGetCommerce();
  const { data: orderRows, isLoading } = useGridbaseAll<IOrder>(ORDER_TABLE);
  const { data: products } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);

  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const myOrders = useMemo(() => {
    return (orderRows ?? [])
      .filter((o) => String(o.userId ?? "") === String(usr?.id ?? ""))
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orderRows, usr]);

  const imageFor = (item: IParsedItem) => {
    const variant = (variants ?? []).find((v) => v.id === item.variantId);
    if (variant?.variantImage) return resolveImg(variant.variantImage);
    const product = (products ?? []).find((p) => p.id === item.productId);
    return resolveImg(product?.mainImage);
  };

  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Siparişlerim" pageTitle={brand?.companyName || "Workgrid"} />

        <Row>
          <Col xl={12}>
            {myOrders.length === 0 ? (
              <Card className="border border-2">
                <CardBody className="py-5 text-center">
                  <i className="ri-shopping-bag-3-line display-4 text-muted" />
                  <h5 className="mt-3">Henüz siparişiniz yok</h5>
                  <p className="text-muted">İlk siparişinizi vermek için alışverişe başlayın.</p>
                  <Link to="/products" className="btn btn-primary mt-2">
                    Alışverişe Başla
                  </Link>
                </CardBody>
              </Card>
            ) : (
              myOrders.map((order) => {
                const items = safeParseItems(order.items);
                const st = statusInfo(order.status);
                const isOpen = openId === order.id;
                const totalQty = items.reduce((s, i) => s + (Number(i.quantity) || 0), 0);

                return (
                  <Card className="border border-2" key={order.id}>
                    {/* ── Kart başlığı (tıklanınca açılır) ── */}
                    <div
                      className="card-header"
                      style={{ cursor: "pointer" }}
                      onClick={() => toggle(order.id)}
                    >
                      <Row className="align-items-center gy-2">
                        <Col sm>
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-sm flex-shrink-0">
                              <div className={`avatar-title rounded bg-${st.class}-subtle text-${st.class} fs-20`}>
                                <i className={st.icon} />
                              </div>
                            </div>
                            <div>
                              <h6 className="fs-15 mb-1">
                                Sipariş <span className="font-monospace">{order.orderNo}</span>
                              </h6>
                              <p className="text-muted mb-0 fs-13">
                                <i className="ri-calendar-line me-1 align-middle" />
                                {moment(order.orderDate).format("DD MMM YYYY, HH:mm")}
                                <span className="mx-2">·</span>
                                {totalQty} ürün
                              </p>
                            </div>
                          </div>
                        </Col>
                        <Col sm="auto">
                          <div className="d-flex align-items-center gap-3">
                            <Badge color={st.class} className="fs-12">
                              {st.label}
                            </Badge>
                            <h5 className="fs-15 mb-0">
                              {data?.currencyCode}{Number(order.total).toFixed(2)}
                            </h5>
                            <i className={classnames("ri-arrow-down-s-line fs-20 text-muted", { "rotate-180": isOpen })}
                              style={{ transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "none" }} />
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* ── Açılır içerik ── */}
                    <Collapse isOpen={isOpen}>
                      <CardBody>
                        {/* Ürün satırları */}
                        <div className="vstack gap-3">
                          {items.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center gap-3">
                              <div className="flex-shrink-0 rounded overflow-hidden bg-light" style={{ width: 56, height: 56 }}>
                                <img
                                  src={imageFor(item)}
                                  alt=""
                                  className="img-fluid w-100 h-100"
                                  style={{ objectFit: "cover" }}
                                  onError={(e) => {
                                    e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                                    e.currentTarget.onerror = null;
                                  }}
                                />
                              </div>
                              <div className="flex-grow-1 overflow-hidden">
                                <h6 className="fs-14 mb-1 text-truncate">
                                  {item.productId ? (
                                    <Link to={`/order-details/${item.productId}`} className="text-body">
                                      {item.name ?? "Ürün"}
                                    </Link>
                                  ) : (item.name ?? "Ürün")}
                                </h6>
                                <p className="text-muted mb-0 fs-13">
                                  {item.combination && <span className="me-2">{item.combination}</span>}
                                  {data?.currencyCode}{Number(item.discountedUnitPrice ?? item.unitPrice ?? 0)} × {item.quantity ?? 1}
                                </p>
                              </div>
                              <div className="flex-shrink-0 fw-semibold fs-14">
                                {data?.currencyCode}{Number(item.lineTotal ?? 0).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <hr className="border-top-dashed" />

                        {/* Özet + aksiyon */}
                        <Row className="align-items-center gy-3">
                          <Col md>
                            <div className="d-flex flex-wrap gap-4 text-muted fs-13">
                              <div>
                                Ara toplam:{" "}
                                <span className="fw-medium text-body">{data?.currencyCode}{Number(order.subTotal).toFixed(2)}</span>
                              </div>
                              {Number(order.discount) > 0 && (
                                <div>
                                  İndirim{order.couponCode ? ` (${order.couponCode})` : ""}:{" "}
                                  <span className="fw-medium text-danger">- {data?.currencyCode}{Number(order.discount).toFixed(2)}</span>
                                </div>
                              )}
                              <div>
                                Kargo:{" "}
                                <span className="fw-medium text-body">
                                  {Number(order.shippingCharge) === 0 ? "Ücretsiz" : `${data?.currencyCode}${Number(order.shippingCharge).toFixed(2)}`}
                                </span>
                              </div>
                              <div>
                                Toplam:{" "}
                                <span className="fw-semibold text-body">{data?.currencyCode}{Number(order.total).toFixed(2)}</span>
                              </div>
                            </div>
                          </Col>
                          <Col md="auto">
                            <Link to={`/invoice-details/${order.id}`} className="btn btn-light btn-sm me-2">
                              <i className="ri-file-list-3-line align-bottom me-1" />
                              Faturayı Gör
                            </Link>
                            <Link to={`/order-details/${order.id}`} className="btn btn-soft-primary btn-sm">
                              <i className="ri-eye-line align-bottom me-1" />
                              Detayları Gör <i className="ms-1 ri-arrow-right-line"></i>
                            </Link>
                          </Col>
                        </Row>
                      </CardBody>
                    </Collapse>
                  </Card>
                );
              })
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceUserOrders;