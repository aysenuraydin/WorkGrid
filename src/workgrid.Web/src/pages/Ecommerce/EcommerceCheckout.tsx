import React, { useEffect, useMemo, useState } from "react";
import {
  Container, Form, Row, Col, Card, CardBody, CardHeader,
  Nav, NavItem, NavLink, TabContent, TabPane,
  Modal, ModalFooter, ModalHeader, ModalBody, Label, Input,
  Progress,
} from "reactstrap";
import Select from "react-select";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import BreadCrumb from "components/Common/BreadCrumb";
import { useGetBrand } from "hooks/useBrand";
import { useAuth } from "context/AuthContext";
import { useGridbaseAll, useDeleteRow, useCreateRow, useUpdateRow } from "hooks/useGridBase";
import { IAddress, ICart, ICoupon, IInvoice, IOrder, IProduct, IProductVariant } from "common/data/ecommerce";
import {
  CART_TABLE, ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE,
  ADDRESS_TABLE, ORDER_TABLE, COUPON_TABLE,
  INVOICE_TABLE,
} from "common/data/constans";
import config from "config";
import { useUserProfile } from "hooks/useUser";
import { useCommerce } from "helpers/useCommerce";


const CHECKOUT_CONFIG = {
  PAYMENT_METHODS: {
    paypal: { label: "PayPal",              icon: "ri-paypal-fill"           },
    card:   { label: "Kredi / Banka Kartı", icon: "ri-bank-card-fill"        },
    cod:    { label: "Kapıda Ödeme",        icon: "ri-money-dollar-box-fill" },
  },
  MAX_COUPON_DISCOUNT_PERCENT: null as number | null,
};

const SHIPPING_METHOD = "EXPRESS";

const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
    : name.startsWith("http")
    ? name
    : `${config.api.FILE_API_URL}/File/${name}`;

const generateOrderNo = () => "ORD-" + Date.now().toString(36).toUpperCase();

const STEPS = [
  { id: 1, label: "Kişisel Bilgiler",    icon: "ri-user-2-line"         },
  { id: 2, label: "Teslimat",            icon: "ri-truck-line"           },
  { id: 3, label: "Ödeme",               icon: "ri-bank-card-line"       },
  { id: 4, label: "Tamamlandı",          icon: "ri-checkbox-circle-line" },
] as const;

type StepId = typeof STEPS[number]["id"];

const StepBadge = ({ step, active, done }: { step: typeof STEPS[number]; active: boolean; done: boolean }) => (
  <div
    className={classnames(
      "d-flex flex-column align-items-center gap-1 flex-fill py-3 border-bottom border-3",
      {
        "border-primary text-primary":   active,
        "border-success text-success":   done && !active,
        "border-transparent text-muted": !active && !done,
      }
    )}
    style={{ transition: "all .2s", borderBottomStyle: "solid" }}
  >
    <div
      className={classnames("rounded-circle d-flex align-items-center justify-content-center", {
        "text-white": active || (done && !active),
        "text-muted": !active && !done,
        "bg-light": !active && !done,
        "bg-success": done && !active
      })}
      style={{ 
        width: 36, height: 36, fontSize: 16,
        backgroundColor: active ? "var(--vz-primary)" : undefined 
      }}
    >
      {done && !active ? <i className="ri-check-line" /> : <i className={step.icon} />}
    </div>
    <span className="fs-12 fw-semibold d-none d-sm-block">{step.label}</span>
  </div>
);

const EcommerceCheckout = () => {
  const { data: brand } = useGetBrand();
  document.title = "Ödeme | " + (brand?.companyName || "Workgrid");
  const { user } = useAuth();
  const { data: usr } = useUserProfile(user?.id ?? "");

  const { currency: CUR, shippingFee, formatPrice } = useCommerce();

  const [activeTab, setActiveTab] = useState<StepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  const markStepComplete = (step: StepId) =>
    setCompletedSteps((prev:any) => new Set([...prev, step]));

  const goToStep = (target: StepId) => {
    if (target < activeTab) { setActiveTab(target); return; }
    for (let s = 1 as StepId; s < target; s++) {
      if (!completedSteps.has(s as StepId)) {
        toast.warning(`Lütfen önce "${STEPS.find(x => x.id == s)?.label}" adımını tamamlayın.`);
        return;
      }
    }
    setActiveTab(target);
  };

  // ── modal state  
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(null);

  // ── form & seçim state  
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<keyof typeof CHECKOUT_CONFIG.PAYMENT_METHODS>("card");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [createdOrderNo, setCreatedOrderNo] = useState("");

  // ── adres formu 
  const [addrForm, setAddrForm] = useState({
    fullName: "", phone: "", address: "",
    country: "", state: "", zipCode: "", label: "home",
  });

  // ── kişisel bilgi formu (tab1)  
  const [billingForm, setBillingForm] = useState({
    firstName: usr?.firstName ?? "",
    lastName:  usr?.lastName  ?? "",
    email:     usr?.email     ?? "",
    phone:     usr?.phoneNumber ?? "",
    address:    usr?.address ?? "",
    country:   usr?.country   ?? "",
    state:     usr?.city,
    zipCode:   usr?.zipCode   ?? "",
  });

  // ── kart formu (tab3) 
  const [cardForm, setCardForm] = useState({
    name: "", number: "", expiry: "", cvv: "",
  });

  // ── data hooks 
  const { data: cartRows }  = useGridbaseAll<ICart>(CART_TABLE);
  const { data: products }  = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants }  = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const { data: addresses } = useGridbaseAll<IAddress>(ADDRESS_TABLE);
  const { data: coupons }   = useGridbaseAll<ICoupon>(COUPON_TABLE);

  const createOrder    = useCreateRow(ORDER_TABLE);
  const deleteCartItem = useDeleteRow(CART_TABLE);
  const createAddress  = useCreateRow(ADDRESS_TABLE);
  const updateAddress  = useUpdateRow(ADDRESS_TABLE);
  const deleteAddress  = useDeleteRow(ADDRESS_TABLE);
  const createInvoice = useCreateRow(INVOICE_TABLE);

  // ── sepet ürünleri 
  const cartItems = useMemo(() => {
    return (cartRows ?? []).map((c) => {
      const product  = (products ?? []).find((p) => p.id == c.wGProductId);
      const variant  = (variants ?? []).find((v) => v.id == c.wGProductVariantId);
      const unitPrice = Number(variant?.price ?? 0);
      const discountPercent = Number(variant?.discountPercent ?? 0);
      const discountedUnitPrice =
        discountPercent > 0
          ? Math.round(unitPrice * (1 - discountPercent / 100) * 100) / 100
          : unitPrice;
      return {
        cartId: c.id,
        productId: c.wGProductId,
        variantId: c.wGProductVariantId,
        name: product?.name ?? "Ürün",
        combination: variant?.combination ?? "",
        image: variant?.variantImage
          ? resolveImg(variant.variantImage)
          : resolveImg(product?.mainImage),
        quantity: c.quantity,
        unitPrice,
        discountPercent,
        discountedUnitPrice,
        lineTotal: Math.round(discountedUnitPrice * c.quantity * 100) / 100,
      };
    });
  }, [cartRows, products, variants]);

  // ── toplamlar 
  const subTotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [cartItems]
  );
  // Kargo: site ayarından gelen sabit ücret (sepet boşsa 0)
  const shippingCharge = cartItems.length > 0 ? shippingFee : 0;
  const total = Math.round((subTotal - discount + shippingCharge) * 100) / 100;

  const selectedAddress = useMemo(
    () => (addresses ?? []).find((a) => a.id == selectedAddressId) ?? null,
    [addresses, selectedAddressId]
  );

  // ── doğrulama & adım geçişleri 
  const validateStep1 = () => {
    if (!billingForm.firstName.trim() || !billingForm.lastName.trim()) {
      toast.error("Ad ve soyad zorunludur."); return false;
    }
    if (!billingForm.phone.trim()) {
      toast.error("Telefon numarası zorunludur."); return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!selectedAddressId) {
      toast.error("Lütfen bir teslimat adresi seçin."); return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (paymentMethod == "card") {
      if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) {
        toast.error("Kart bilgilerini eksiksiz doldurun."); return false;
      }
    }
    return true;
  };

  const proceedFromStep1 = () => {
    if (!validateStep1()) return;
    markStepComplete(1);
    setActiveTab(2);
  };

  const proceedFromStep2 = () => {
    if (!validateStep2()) return;
    markStepComplete(2);
    setActiveTab(3);
  };

  // ── kupon 
  const applyCoupon = () => {
    if (!couponCode.trim()) { toast.error("Kupon kodu girin."); return; }
    const now    = new Date();
    const coupon = (coupons ?? []).find(
      (c) => c.code.toUpperCase() == couponCode.trim().toUpperCase()
    );
    if (!coupon) { toast.error("Geçersiz kupon kodu."); return; }
    if (!coupon.isActive) { toast.error("Bu kupon aktif değil."); return; }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      toast.error("Bu kuponun süresi dolmuş."); return;
    }
    if (coupon.minAmount != null && subTotal < coupon.minAmount) {
      toast.error(`Bu kupon için minimum sipariş tutarı ${formatPrice(coupon.minAmount)}.`); return;
    }
    const calculated =
      coupon.discountType == "percent"
        ? Math.round(subTotal * (coupon.discountValue / 100) * 100) / 100
        : Math.min(coupon.discountValue, subTotal);
    setDiscount(calculated);
    setAppliedCoupon(coupon.code);
    toast.success(
      `Kupon uygulandı! ${coupon.discountType == "percent" ? `%${coupon.discountValue}` : `${formatPrice(coupon.discountValue)}`} indirim kazandınız.`
    );
  };

  const removeCoupon = () => {
    setDiscount(0); setAppliedCoupon(""); setCouponCode("");
    toast.info("Kupon kaldırıldı.");
  };

  // ── adres modal 
  const openAddModal = () => {
    setEditingAddress(null);
    setAddrForm({ fullName: "", phone: "", address: "", country: "", state: "", zipCode: "", label: "home" });
    setModal(true);
  };
  const openEditModal = (addr: IAddress) => {
    setEditingAddress(addr);
    setAddrForm({
      fullName: addr.fullName, phone: addr.phone, address: addr.address,
      country: addr.country, state: addr.state, zipCode: addr.zipCode, label: addr.label,
    });
    setModal(true);
  };
  const saveAddress = () => {
    if (!addrForm.fullName || !addrForm.phone || !addrForm.address) {
      toast.error("Lütfen zorunlu alanları doldurun."); return;
    }
    const payload = { ...addrForm, userId: usr?.id };
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, payload }, {
        onSuccess: () => { toast.success("Adres güncellendi."); setModal(false); },
        onError:   () => toast.error("Adres güncellenemedi."),
      });
    } else {
      createAddress.mutate(payload as any, {
        onSuccess: (data: any) => {
          toast.success("Adres eklendi.");
          setSelectedAddressId(data?.id ?? null);
          setModal(false);
        },
        onError: () => toast.error("Adres eklenemedi."),
      });
    }
  };
  const confirmDeleteAddress = () => {
    if (!deletingAddressId) return;
    deleteAddress.mutate(deletingAddressId, {
      onSuccess: () => {
        toast.success("Adres silindi.");
        if (selectedAddressId == deletingAddressId) setSelectedAddressId(null);
        setDeleteModal(false);
      },
      onError: () => toast.error("Adres silinemedi."),
    });
  };

  // ── sipariş oluştur 
  const completeOrder = () => {
    if (!validateStep3()) return;
    if (!selectedAddress) { toast.error("Teslimat adresi seçilmedi."); return; }

    const orderNo = generateOrderNo();
    const orderPayload: Omit<IOrder, "id"> = {
      orderNo,
      userId: usr?.id ?? null,
      items: JSON.stringify(
        cartItems.map((i) => ({
          productId: i.productId, variantId: i.variantId,
          name: i.name, combination: i.combination,
          unitPrice: i.unitPrice, discountedUnitPrice: i.discountedUnitPrice,
          quantity: i.quantity, lineTotal: i.lineTotal,
        }))
      ),
      subTotal, discount,
      couponCode: appliedCoupon || null,
      total,
      shippingCharge,
      paymentMethod,
      status: "pending",
      shippingAddress: JSON.stringify({
        fullName: selectedAddress.fullName, phone: selectedAddress.phone,
        address: selectedAddress.address, country: selectedAddress.country,
        state: selectedAddress.state, zipCode: selectedAddress.zipCode,
        label: selectedAddress.label,
      }),
      orderDate: new Date().toISOString(),
    };

    createOrder.mutate(orderPayload as any, {
      onSuccess: (orderData: any) => {
        const orderId = orderData?.id;
        if (orderId) {
          const invoicePayload: Omit<IInvoice, "id"> = {
            wGOrderId: orderId,

            firstName: billingForm.firstName,
            lastName:  billingForm.lastName,
            email:     billingForm.email || null,
            phone:     billingForm.phone,

            address:  billingForm.address || selectedAddress.address,
            country:  billingForm.country || selectedAddress.country,
            state:    billingForm.state   || selectedAddress.state,
            zipCode:  billingForm.zipCode || selectedAddress.zipCode,

            paymentMethod,
            shippingMethod: SHIPPING_METHOD,
            shippingCharge,

            subTotal,
            discount,
            couponCode: appliedCoupon || null,
            total,

            createdAt: new Date().toISOString(),
          };

          createInvoice.mutate(invoicePayload as any, {
            onError: () => toast.error("Fatura oluşturulamadı."),
          });
        }

        (cartRows ?? []).forEach((c) => deleteCartItem.mutate(c.id));
        setCreatedOrderNo(orderNo);
        markStepComplete(3);
        setActiveTab(4);
      },
      onError: () => toast.error("Sipariş oluşturulamadı."),
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
        <Container fluid>
          <BreadCrumb title="Ödeme" pageTitle={brand?.companyName || "Workgrid"} />

          <Row className="justify-content-center">
            <Col xl={activeTab !==4 ? 8 : 12}>

              {/* ── Adım göstergesi ── */}
              <Card className="mb-0 border-0 shadow-none">
                <CardBody className="p-0">
                  <div className="d-flex">
                    {STEPS.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        className="btn p-0 flex-fill border-0 bg-transparent"
                        onClick={() => goToStep(step.id as StepId)}
                        style={{
                          cursor:
                            step.id > activeTab && !completedSteps.has((step.id - 1) as StepId)
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <StepBadge
                          step={step}
                          active={activeTab == step.id}
                          done={completedSteps.has(step.id as StepId)}
                        />
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-2 shadow-none mt-0" style={{ borderTop: "none", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>

                    <TabPane tabId={1}>
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-1">Fatura Bilgileri</h5>
                        <p className="text-muted fs-13">Fatura oluşturulması için gerekli bilgileri giriniz.</p>
                      </div>
                      <Row className="g-3">
                        <Col sm={6}>
                          <Label className="form-label">Ad <span className="text-danger">*</span></Label>
                          <Input
                            value={billingForm.firstName}
                            onChange={(e) => setBillingForm(p => ({ ...p, firstName: e.target.value }))}
                            placeholder="Adınız"
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">Soyad <span className="text-danger">*</span></Label>
                          <Input
                            value={billingForm.lastName}
                            onChange={(e) => setBillingForm(p => ({ ...p, lastName: e.target.value }))}
                            placeholder="Soyadınız"
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">E-posta <span className="text-muted fs-12">(İsteğe Bağlı)</span></Label>
                          <Input
                            type="email"
                            value={billingForm.email}
                            onChange={(e) => setBillingForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="ornek@mail.com"
                          />
                        </Col>
                        <Col sm={6}>
                          <Label className="form-label">Telefon <span className="text-danger">*</span></Label>
                          <Input
                            value={billingForm.phone}
                            onChange={(e) => setBillingForm(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+90 5xx xxx xx xx"
                          />
                        </Col>
                        <Col xs={12}>
                          <Label className="form-label">Adres</Label>
                          <Input
                            type="textarea" rows={2}
                            value={billingForm.address}
                            onChange={(e) => setBillingForm(p => ({ ...p, address: e.target.value }))}
                            placeholder="Sokak, mahalle, ilçe bilgilerinizi giriniz..."
                          />
                        </Col>
                        <Col md={4}>
                          <Label className="form-label">Ülke</Label>
                          <Input
                            value={billingForm.country}
                            onChange={(e) => setBillingForm(p => ({ ...p, country: e.target.value }))}
                            placeholder="Türkiye"
                          />
                        </Col>
                        <Col md={4}>
                          <Label className="form-label">Şehir</Label>
                          <Input
                            value={billingForm.state}
                            onChange={(e) => setBillingForm(p => ({ ...p, state: e.target.value }))}
                            placeholder="İstanbul"
                          />
                        </Col>
                        <Col md={4}>
                          <Label className="form-label">Posta Kodu</Label>
                          <Input
                            value={billingForm.zipCode}
                            onChange={(e) => setBillingForm(p => ({ ...p, zipCode: e.target.value }))}
                            placeholder="34000"
                          />
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-primary" onClick={proceedFromStep1}>
                          Teslimat Bilgilerine Geç
                          <i className="ri-truck-line ms-2 align-middle" />
                        </button>
                      </div>
                    </TabPane>

                    <TabPane tabId={2}>
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-1">Teslimat Bilgileri</h5>
                        <p className="text-muted fs-13">Lütfen teslimat adresinizi seçin veya yeni bir adres ekleyin.</p>
                      </div>

                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-semibold mb-0">Kayıtlı Adreslerim</h6>
                        <button type="button" className="btn btn-sm btn-soft-primary" onClick={openAddModal}>
                          <i className="ri-add-line me-1" />Yeni Adres Ekle
                        </button>
                      </div>

                      {(addresses ?? []).length == 0 ? (
                        <div className="text-center py-4 bg-light rounded mb-4">
                          <i className="ri-map-pin-2-line fs-36 text-muted d-block mb-2" />
                          <p className="text-muted mb-2">Kayıtlı adresiniz bulunamadı.</p>
                          <button type="button" className="btn btn-sm btn-primary" onClick={openAddModal}>
                            İlk Adresinizi Ekleyin
                          </button>
                        </div>
                      ) : (
                        <Row className="g-3 mb-4">
                          {(addresses ?? []).map((addr) => (
                            <Col lg={4} sm={6} key={addr.id}>
                              <div
                                className={classnames("border rounded overflow-hidden", {
                                  "border-primary border-2": selectedAddressId == addr.id,
                                })}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedAddressId(addr.id)}
                              >
                                <div className="p-3">
                                  <div className="d-flex align-items-start justify-content-between mb-2">
                                    <span className={classnames("badge text-uppercase", {
                                      "bg-primary-subtle text-primary": selectedAddressId == addr.id,
                                      "bg-light text-muted": selectedAddressId !== addr.id,
                                    })}>
                                      {addr.label == "home" ? "Ev" : "İş"}
                                    </span>
                                    {selectedAddressId == addr.id && (
                                      <i className="ri-checkbox-circle-fill text-primary fs-16" />
                                    )}
                                  </div>
                                  <div className="fw-semibold fs-14 mb-1">{addr.fullName}</div>
                                  <div className="text-muted fs-13 mb-1">
                                    {addr.address}, {addr.state} {addr.zipCode}
                                  </div>
                                  <div className="text-muted fs-13">{addr.phone}</div>
                                </div>
                                <div className="d-flex border-top bg-light">
                                  <button
                                    type="button"
                                    className="btn btn-link text-muted fs-12 py-1 px-3"
                                    onClick={(e) => { e.stopPropagation(); openEditModal(addr); }}
                                  >
                                    <i className="ri-pencil-line me-1" />Düzenle
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-link text-danger fs-12 py-1 px-3 ms-auto"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingAddressId(addr.id);
                                      setDeleteModal(true);
                                    }}
                                  >
                                    <i className="ri-delete-bin-line me-1" />Sil
                                  </button>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      )}

                      <div className="border rounded p-3 d-flex align-items-center gap-3 mb-4 bg-light-subtle">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-primary text-white"
                          style={{ width: 40, height: 40 }}
                        >
                          <i className="ri-flashlight-line fs-18" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold fs-14">Hızlı Teslimat</div>
                          <div className="text-muted fs-12">Siparişiniz öncelikli olarak işleme alınır.</div>
                        </div>
                        <div className="fw-bold fs-15">
                          {shippingCharge == 0 ? "Ücretsiz" : formatPrice(shippingCharge)}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-light" onClick={() => goToStep(1)}>
                          <i className="ri-arrow-left-line me-2 align-middle" />Geri
                        </button>
                        <button type="button" className="btn btn-primary" onClick={proceedFromStep2}>
                          Ödeme Adımına Geç
                          <i className="ri-bank-card-line ms-2 align-middle" />
                        </button>
                      </div>
                    </TabPane>

                    <TabPane tabId={3}>
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-1">Ödeme Yöntemi</h5>
                        <p className="text-muted fs-13">Lütfen tercih ettiğiniz ödeme yöntemini seçin.</p>
                      </div>

                      <div className="alert alert-warning py-2 d-flex align-items-center gap-2 mb-3">
                        <i className="ri-information-line fs-16 flex-shrink-0" />
                        <small>Güvenli ödeme altyapısı ile işlemleriniz korunmaktadır.</small>
                      </div>

                      <Row className="g-3 mb-4">
                        {(Object.entries(CHECKOUT_CONFIG.PAYMENT_METHODS) as [keyof typeof CHECKOUT_CONFIG.PAYMENT_METHODS, { label: string; icon: string }][]).map(
                          ([key, opt]) => (
                            <Col lg={4} sm={6} key={key}>
                              <div
                                className={classnames("border rounded p-3 d-flex align-items-center gap-2", {
                                  "border-primary border-2 bg-primary-subtle bg-opacity-25": paymentMethod == key,
                                })}
                                style={{ cursor: "pointer" }}
                                onClick={() => setPaymentMethod(key)}
                              >
                                <i className={classnames(opt.icon, "fs-22", {
                                  "text-primary": paymentMethod == key,
                                  "text-muted": paymentMethod !== key,
                                })} />
                                <span className={classnames("fs-14 fw-medium", {
                                  "text-primary": paymentMethod == key,
                                })}>
                                  {opt.label}
                                </span>
                                {paymentMethod == key && (
                                  <i className="ri-checkbox-circle-fill text-primary ms-auto" />
                                )}
                              </div>
                            </Col>
                          )
                        )}
                      </Row>

                      {paymentMethod == "card" && (
                        <Card className="border shadow-none mb-4">
                          <CardBody>
                            <Row className="g-3">
                              <Col xs={12}>
                                <Label className="form-label">Kart Üzerindeki İsim <span className="text-danger">*</span></Label>
                                <Input
                                  value={cardForm.name}
                                  onChange={(e) => setCardForm(p => ({ ...p, name: e.target.value }))}
                                  placeholder="Ad Soyad"
                                />
                              </Col>
                              <Col xs={12}>
                                <Label className="form-label">Kart Numarası <span className="text-danger">*</span></Label>
                                <Input
                                  value={cardForm.number}
                                  onChange={(e) => setCardForm(p => ({ ...p, number: e.target.value }))}
                                  placeholder="•••• •••• •••• ••••"
                                  maxLength={19}
                                />
                              </Col>
                              <Col sm={6}>
                                <Label className="form-label">Son Kullanma Tarihi <span className="text-danger">*</span></Label>
                                <Input
                                  value={cardForm.expiry}
                                  onChange={(e) => setCardForm(p => ({ ...p, expiry: e.target.value }))}
                                  placeholder="AA/YY"
                                  maxLength={5}
                                />
                              </Col>
                              <Col sm={6}>
                                <Label className="form-label">CVV <span className="text-danger">*</span></Label>
                                <Input
                                  value={cardForm.cvv}
                                  onChange={(e) => setCardForm(p => ({ ...p, cvv: e.target.value }))}
                                  placeholder="•••"
                                  maxLength={4}
                                />
                              </Col>
                            </Row>
                            <div className="d-flex align-items-center gap-2 mt-3 text-muted fs-12">
                              <i className="ri-shield-check-line text-success fs-15" />
                              Ödeme bilgileriniz 256-bit SSL sertifikası ile şifrelenmektedir.
                            </div>
                          </CardBody>
                        </Card>
                      )}

                      <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-light" onClick={() => goToStep(2)}>
                          <i className="ri-arrow-left-line me-2 align-middle" />Geri
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={completeOrder}
                          disabled={createOrder.isPending}
                        >
                          {createOrder.isPending ? (
                            <><span className="spinner-border spinner-border-sm me-2" />İşleniyor...</>
                          ) : (
                            <><i className="ri-shopping-basket-line me-2 align-middle" />Siparişi Onayla</>
                          )}
                        </button>
                      </div>
                    </TabPane>

                    <TabPane tabId={4}>
                      <div className="text-center py-5">
                        <div
                          className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-4"
                          style={{ width: 80, height: 80 }}
                        >
                          <i className="ri-checkbox-circle-fill text-success fs-36" />
                        </div>
                        <h4 className="fw-semibold mb-2">Siparişiniz Başarıyla Alındı!</h4>
                        <p className="text-muted mb-1">
                          Sipariş detaylarını içeren onay e-postası kayıtlı adresinize gönderildi.
                        </p>
                        <div className="d-inline-flex align-items-center gap-2 bg-light rounded px-4 py-2 my-3">
                          <span className="text-muted fs-13">Sipariş No:</span>
                          <span className="fw-bold font-monospace fs-15">{createdOrderNo}</span>
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-3 col-sm-12">
                          <Link to="/orders" className="btn btn-light w-100">
                            <i className="ri-file-list-3-line me-1" />Siparişlerim
                          </Link>
                          <Link to="/products" className="btn btn-primary w-100">
                            <i className="ri-store-2-line me-1" />Alışverişe Devam Et
                          </Link>
                        </div>
                      </div>
                    </TabPane>

                  </TabContent>
                </CardBody>
              </Card>
            </Col>

            {activeTab !==4 &&
              <Col xl={4}>
                <Card className="border border-2 shadow-none">
                  <CardHeader className="bg-transparent">
                    <h5 className="mb-0 fw-semibold">Sipariş Özeti</h5>
                  </CardHeader>
                  <CardBody>
                    <div className="vstack gap-3">
                      {cartItems.map((item) => (
                        <div key={item.cartId} className="d-flex align-items-center gap-3">
                          <div
                            className="flex-shrink-0 rounded overflow-hidden bg-light"
                            style={{ width: 56, height: 56 }}
                          >
                            <img
                              src={item.image} alt=""
                              className="img-fluid w-100 h-100"
                              style={{ objectFit: "cover" }}
                              onError={(e) => {
                                e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                                e.currentTarget.onerror = null;
                              }}
                            />
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="fw-semibold fs-14 text-truncate">
                              <Link to={`/product-detail/${item.productId}`} className="text-body">
                                {item.name}
                              </Link>
                            </div>
                            <div className="text-muted fs-12">
                              {item.combination && <span className="me-2">{item.combination}</span>}
                              {formatPrice(item.discountedUnitPrice)} × {item.quantity}
                            </div>
                          </div>
                          <div className="flex-shrink-0 fw-semibold fs-14">
                            {formatPrice(item.lineTotal)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="vstack gap-2">
                      <div className="d-flex justify-content-between text-muted fs-13">
                        <span>Ara Toplam</span>
                        <span>{formatPrice(subTotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="d-flex justify-content-between text-muted fs-13">
                          <span>
                            İndirim
                            {appliedCoupon && (
                              <span className="badge bg-success-subtle text-success ms-1 font-monospace">
                                {appliedCoupon}
                              </span>
                            )}
                          </span>
                          <span className="text-success">- {formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between text-muted fs-13">
                        <span>Kargo</span>
                        <span>
                          {shippingCharge == 0
                            ? <span className="text-success">Ücretsiz</span>
                            : formatPrice(shippingCharge)
                          }
                        </span>
                      </div>
                      <hr className="my-1" />
                      <div className="d-flex justify-content-between fw-bold fs-15">
                        <span>Toplam</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Kupon */}
                    <div className="mt-3">
                      {appliedCoupon ? (
                        <div className="d-flex align-items-center gap-2 bg-success-subtle rounded px-3 py-2">
                          <i className="ri-coupon-3-line text-success" />
                          <span className="text-success fs-13 fw-semibold flex-grow-1">
                            {appliedCoupon} — -{formatPrice(discount)}
                          </span>
                          <button type="button" className="btn btn-sm btn-ghost-danger p-0 px-1" onClick={removeCoupon}>
                            <i className="ri-close-line" />
                          </button>
                        </div>
                      ) : (
                        <div className="input-group">
                          <input
                            className="form-control fs-13"
                            type="text"
                            placeholder="Kupon kodunuzu girin"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key == "Enter" && applyCoupon()}
                          />
                          <button type="button" className="btn btn-primary" onClick={applyCoupon}>
                            Uygula
                          </button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Teslimat özeti */}
                {selectedAddress && (
                  <Card className="border shadow-none mt-3">
                    <CardBody>
                      <h6 className="fw-semibold mb-2">
                        <i className="ri-map-pin-2-line me-1 text-primary" />Teslimat Adresi
                      </h6>
                      <div className="text-muted fs-13">
                        <div className="fw-medium text-body">{selectedAddress.fullName}</div>
                        <div>{selectedAddress.address}</div>
                        <div>{selectedAddress.state} {selectedAddress.zipCode}</div>
                        <div>{selectedAddress.phone}</div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </Col>
            }
          </Row>
        </Container>
      </div>

      <Modal isOpen={deleteModal} centered toggle={() => setDeleteModal(!deleteModal)}>
        <ModalBody>
          <div className="text-center mt-3">
            <div
              className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 60, height: 60 }}
            >
              <i className="ri-delete-bin-5-line text-danger fs-24" />
            </div>
            <h5 className="mb-1">Adresi Sil</h5>
            <p className="text-muted">Bu adresi silmek istediğinize emin misiniz?</p>
            <div className="d-flex gap-2 justify-content-center mt-3 mb-2">
              <button type="button" className="btn btn-light px-4" onClick={() => setDeleteModal(false)}>
                Vazgeç
              </button>
              <button type="button" className="btn btn-danger px-4" onClick={confirmDeleteAddress}>
                Evet, Sil
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal} centered toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          {editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}
        </ModalHeader>
        <ModalBody>
          <div className="vstack gap-3">
            <div>
              <Label className="form-label">Ad Soyad <span className="text-danger">*</span></Label>
              <Input
                placeholder="Ad Soyad"
                value={addrForm.fullName}
                onChange={(e) => setAddrForm(p => ({ ...p, fullName: e.target.value }))}
              />
            </div>
            <div>
              <Label className="form-label">Adres <span className="text-danger">*</span></Label>
              <Input
                type="textarea" rows={2}
                placeholder="Sokak, mahalle bilgilerinizi yazınız..."
                value={addrForm.address}
                onChange={(e) => setAddrForm(p => ({ ...p, address: e.target.value }))}
              />
            </div>
            <div>
              <Label className="form-label">Telefon <span className="text-danger">*</span></Label>
              <Input
                placeholder="+90 5xx xxx xx xx"
                value={addrForm.phone}
                onChange={(e) => setAddrForm(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <Row className="g-2">
              <Col sm={6}>
                <Label className="form-label">Ülke</Label>
                <Input
                  placeholder="Türkiye"
                  value={addrForm.country}
                  onChange={(e) => setAddrForm(p => ({ ...p, country: e.target.value }))}
                />
              </Col>
              <Col sm={6}>
                <Label className="form-label">Şehir</Label>
                <Input
                  placeholder="İstanbul"
                  value={addrForm.state}
                  onChange={(e) => setAddrForm(p => ({ ...p, state: e.target.value }))}
                />
              </Col>
              <Col sm={6}>
                <Label className="form-label">Posta Kodu</Label>
                <Input
                  placeholder="34000"
                  value={addrForm.zipCode}
                  onChange={(e) => setAddrForm(p => ({ ...p, zipCode: e.target.value }))}
                />
              </Col>
              <Col sm={6}>
                <Label className="form-label">Adres Tipi</Label>
                <select
                  className="form-select"
                  value={addrForm.label}
                  onChange={(e) => setAddrForm(p => ({ ...p, label: e.target.value }))}
                >
                  <option value="home">Ev</option>
                  <option value="office">İş</option>
                </select>
              </Col>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-light" onClick={() => setModal(false)}>Vazgeç</button>
          <button type="button" className="btn btn-primary" onClick={saveAddress}>Kaydet</button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default EcommerceCheckout;