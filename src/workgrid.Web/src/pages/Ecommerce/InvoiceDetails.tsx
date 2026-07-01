import { useMemo } from "react";
import { CardBody, Row, Col, Card, Table, CardHeader, Container } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import moment from "moment"; 
import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";

import { useGridbaseById, useGridbaseOne } from "hooks/useGridBase";
import { IInvoice, IOrder } from "common/data/ecommerce";
import { INVOICE_TABLE, ORDER_TABLE } from "common/data/constans";
import { useGetContact } from "hooks/useContact";
import { useTenantContext } from "context/TenantContext";
import config from "config";
import { useCommerce } from "helpers/useCommerce";

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

const InvoiceDetails = () => {
  const { id:orderId } = useParams();

  const { data: brand } = useGetBrand();
  const { data: contact } = useGetContact();
  const { config:tenantConfig } = useTenantContext();

  const { formatPrice, invoiceNotes } = useCommerce();

  document.title = "Invoice Details | " + (brand?.companyName || "Workgrid");

  const { data: invoice, isLoading } = useGridbaseOne<IInvoice>(
    INVOICE_TABLE,
    { filter: [`wGOrderId:eq:${orderId}`] },
    { enabled: !!orderId }
  );

  const { data: order } = useGridbaseById<IOrder>(ORDER_TABLE, Number(orderId));

  const items = useMemo<IParsedItem[]>(() => safeParse<IParsedItem[]>(order?.items, []), [order]);
  const shipAddr = useMemo<IParsedAddress>(() => safeParse<IParsedAddress>(order?.shippingAddress, {}), [order]);

  const printInvoice = () => window.print();

  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  if (!invoice) {
    return (
      <div className="page-content"><Container fluid>
        <div className="py-5 text-center">
          <i className="ri-error-warning-line display-5 text-muted" />
          <h5 className="mt-3">Fatura bulunamadı</h5>
          <Link to="/ecommerce-orders" className="btn btn-primary mt-2">Siparişlerime Dön</Link>
        </div>
      </Container></div>
    );
  }

  const fullName = `${invoice.firstName ?? ""} ${invoice.lastName ?? ""}`.trim();
  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Fatura Detayları" pageTitle={brand?.companyName || "Workgrid"} />

        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="demo">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom-dashed p-4">
                    <div className="d-flex">
                      <div className="flex-grow-1">
                        <img src={`${config.api.FILE_API_URL}/File/${tenantConfig.logoLightUrl}`} className="card-logo card-logo-dark" alt="logo dark" height="50" />
                        <img src={`${config.api.FILE_API_URL}/File/${tenantConfig.logoDarkUrl}`}  className="card-logo card-logo-light" alt="logo light" height="50" />
                        <div className="mt-sm-5 mt-4">
                          <h6 className="text-muted text-uppercase fw-semibold">Firma Adresi</h6>
                          <p className="text-muted mb-1" id="address-details">
                            {contact?.address1} <br />
                            {contact?.address2}
                          </p>
                          <p className="text-muted mb-0" id="zip-code">
                            <span>Posta Kodu: {contact?.zipCode ?? "—"}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        <h6>
                          <span className="text-muted fw-normal">Vergi No / Sicil No:</span>{" "}
                          <span id="legal-register-no">{brand?.companyName ? "—" : "—"}</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">E-posta:</span>{" "}
                          <span id="email">{contact?.email ?? "iletisim@siteniz.com"}</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Web Sitesi:</span>{" "}
                          <Link to="#" className="link-primary" id="website">
                            {brand?.website ?? "www.siteniz.com"}
                          </Link>
                        </h6>
                        <h6 className="mb-0">
                          <span className="text-muted fw-normal">İletişim:</span>{" "}
                          <span id="contact-no"> {contact?.phone ?? "—"}</span>
                        </h6>
                      </div>
                    </div>
                  </CardHeader>
                </Col>

                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Fatura No</p>
                        <h5 className="fs-14 mb-0">#INV-<span id="invoice-no">{invoice.id}</span></h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Tarih</p>
                        <h5 className="fs-14 mb-0">
                          <span id="invoice-date">{moment(invoice.createdAt).format("DD MMM, YYYY")}</span>{" "}
                          <small className="text-muted" id="invoice-time">{moment(invoice.createdAt).format("HH:mm")}</small>
                        </h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Sipariş No</p>
                        <h5 className="fs-14 mb-0 font-monospace">{order?.orderNo ?? "—"}</h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Toplam Tutar</p>
                        <h5 className="fs-14 mb-0"><span id="total-amount">{formatPrice(invoice.total)}</span></h5>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>

                <Col lg={12}>
                  <CardBody className="p-4 border-top border-top-dashed">
                    <Row className="g-3">
                      <Col sm={6}>
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">Fatura Adresi</h6>
                        <p className="fw-medium mb-2" id="billing-name">{fullName || "—"}</p>
                        {invoice.address && <p className="text-muted mb-1" id="billing-address-line-1">{invoice.address}</p>}
                        <p className="text-muted mb-1"><span>Telefon: </span><span id="billing-phone-no">{invoice.phone ?? "—"}</span></p>
                        {invoice.email && <p className="text-muted mb-0"><span>E-posta: </span><span id="billing-email">{invoice.email}</span></p>}
                      </Col>
                      <Col sm={6}>
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">Teslimat Adresi</h6>
                        <p className="fw-medium mb-2" id="shipping-name">{shipAddr.fullName ?? fullName ?? "—"}</p>
                        {shipAddr.address && <p className="text-muted mb-1" id="shipping-address-line-1">{shipAddr.address}</p>}
                        <p className="text-muted mb-1">
                          {[shipAddr.state, shipAddr.zipCode].filter(Boolean).join(" - ")}
                        </p>
                        <p className="text-muted mb-1"><span>Telefon: </span><span id="shipping-phone-no">{shipAddr.phone ?? "—"}</span></p>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>

                <Col lg={12}>
                  <CardBody className="p-4">
                    <div className="table-responsive">
                      <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" style={{ width: "50px" }}>#</th>
                            <th scope="col" className="text-start">Ürün Detayları</th>
                            <th scope="col">Birim Fiyat</th>
                            <th scope="col">Adet</th>
                            <th scope="col" className="text-end">Tutar</th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {items.length == 0 ? (
                            <tr><td colSpan={5} className="text-muted py-4">Ürün bilgisi bulunamadı.</td></tr>
                          ) : (
                            items.map((item, idx) => (
                              <tr key={idx}>
                                <th scope="row">{String(idx + 1).padStart(2, "0")}</th>
                                <td className="text-start">
                                  <span className="fw-medium">{item.name ?? "Ürün"}</span>
                                  {item.combination && <p className="text-muted mb-0">{item.combination}</p>}
                                </td>
                                <td>{formatPrice(item.discountedUnitPrice ?? item.unitPrice ?? 0)}</td>
                                <td>{String(item.quantity ?? 1).padStart(2, "0")}</td>
                                <td className="text-end">{formatPrice(item.lineTotal ?? 0)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>

                    <div className="border-top border-top-dashed mt-2">
                      <Table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
                        <tbody>
                          <tr>
                            <td>Ara Toplam</td>
                            <td className="text-end">{formatPrice(invoice.subTotal)}</td>
                          </tr>
                          {Number(invoice.discount) > 0 && (
                            <tr>
                              <td>İndirim {invoice.couponCode && <small className="text-muted">({invoice.couponCode})</small>}</td>
                              <td className="text-end">- {formatPrice(invoice.discount)}</td>
                            </tr>
                          )}
                          <tr>
                            <td>Kargo Ücreti</td>
                            <td className="text-end">{formatPrice(invoice.shippingCharge)}</td>
                          </tr>
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Genel Toplam</th>
                            <th className="text-end">{formatPrice(invoice.total)}</th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="mt-3">
                      <h6 className="text-muted text-uppercase fw-semibold mb-3">Ödeme Bilgileri:</h6>
                      <p className="text-muted mb-1">
                        Ödeme Yöntemi:{" "}
                        <span className="fw-medium" id="payment-method">
                          {PAYMENT_LABEL[invoice.paymentMethod] ?? invoice.paymentMethod}
                        </span>
                      </p>
                      <p className="text-muted mb-1">
                        Teslimat Yöntemi:{" "}
                        <span className="fw-medium">{invoice.shippingMethod}</span>
                      </p>
                      <p className="text-muted">
                        Ödenen Tutar: <span className="fw-medium">{formatPrice(invoice.total)}</span>
                      </p>
                    </div>

                    {invoiceNotes && (
                      <div className="mt-4">
                        <div className="alert alert-primary">
                          <p className="mb-0">
                            <span className="fw-semibold">NOTLAR:</span>
                            <span id="note"> {invoiceNotes}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <Link to="#" onClick={printInvoice} className="btn btn-soft-primary">
                        <i className="ri-printer-line align-bottom me-1"></i> Yazdır
                      </Link>
                      <Link to="#" onClick={printInvoice} className="btn btn-primary">
                        <i className="ri-download-2-line align-bottom me-1"></i> İndir
                      </Link>
                    </div>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default InvoiceDetails;