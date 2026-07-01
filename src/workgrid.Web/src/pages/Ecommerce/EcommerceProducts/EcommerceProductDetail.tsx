import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Card, CardBody, Col, Container, Input, Label,
  Nav, NavItem, NavLink, Row, TabContent, TabPane,
} from "reactstrap";
import { Image } from "antd";
import SimpleBar from "simplebar-react";
import { Swiper, SwiperSlide } from "swiper/react";
import classnames from "classnames";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import { CommentList } from "pages/Comment";
import { CommentItemType } from "common/data/comment";
import config from "config";

import { useGridbaseById, useGridbaseAll, useCreateRow, useUpdateRow, usePatchRow, useDeleteRow } from "hooks/useGridBase";
import {
  IProduct, IProductCategory, IProductVariant, IVariantType, IVariantOption,
  IProductService,
  IProductFeature,
  ICart,
  IFavorite,
} from "common/data/ecommerce";
import { useCommentsRaiting } from "hooks/useComment";
import { CART_TABLE, CATEGORY_ECOMMERCE_TABLE, ECOMMERCE_TABLE, FAVORITE_TABLE, PRODUCT_FEATURE_TABLE, PRODUCT_SERVICE_TABLE, PRODUCT_VARIANT_TABLE, VARIANT_OPTION_TABLE, VARIANT_TYPE_TABLE } from "common/data/constans";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";
import { useCommerce } from "helpers/useCommerce";
import useThemeMode from "hooks/useThemeMode";

const resolveImg = (name?: string | null) =>
  !name ? null : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const EcommerceProductDetail = () => {
  const { id } = useParams();
  const productId = Number(id);

  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab: any) => { if (customActiveTab !== tab) setcustomActiveTab(tab); };

  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [quantity, setQuantity] = useState(1);

  const { data: brand } = useGetBrand();
  document.title = "Product Details | " + (brand?.companyName || "Workgrid");

  // Ticaret ayarları (para birimi)
  const { formatPrice } = useCommerce();

  const { data: product, isLoading } = useGridbaseById<IProduct>(ECOMMERCE_TABLE, productId);
  const { data: categories } = useGridbaseAll<IProductCategory>(CATEGORY_ECOMMERCE_TABLE);
  const { data: allVariants } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const { data: allVariantTypes } = useGridbaseAll<IVariantType>(VARIANT_TYPE_TABLE);
  const { data: allVariantOptions } = useGridbaseAll<IVariantOption>(VARIANT_OPTION_TABLE);
  const { data: features } = useGridbaseAll<IProductFeature>(PRODUCT_FEATURE_TABLE);
  const { data: services } = useGridbaseAll<IProductService>(PRODUCT_SERVICE_TABLE);
  const { data: rating } = useCommentsRaiting(CommentItemType.Product.toString(), String(productId));
  const { data: cartRows } = useGridbaseAll<ICart>(CART_TABLE);
  const { data: favoriteRows } = useGridbaseAll<IFavorite>(FAVORITE_TABLE);
  const createCartRow = useCreateRow(CART_TABLE);
  const updateCartRow = usePatchRow(CART_TABLE);
  const createFavorite = useCreateRow(FAVORITE_TABLE);
  const deleteFavorite = useDeleteRow(FAVORITE_TABLE);

  // viewCount artırmak için patch
  const patchProduct = usePatchRow(ECOMMERCE_TABLE);
  // Aynı ürün için yalnızca bir kez saymak için (StrictMode çift-çağrı koruması)
  const countedProductId = useRef<number | null>(null);

  const existingFavorite = useMemo(
    () => (favoriteRows ?? []).find(f => Number(f.wGProductId) == Number(product?.id)),
    [favoriteRows, product]
  );
  const toggleFavorite = () => {
    if (!usr?.id) { toast.error("Favorilere eklemek için giriş yapmalısınız."); return; }

    if (existingFavorite) {
      deleteFavorite.mutate(existingFavorite.id);
    } else {
      createFavorite.mutate(
        { wGProductId: product?.id, addedAt: new Date().toISOString() }
      );
    }
  };

  const { user: usr } = useAuth();
  const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
  const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

  // ── Görüntülenme sayısını artır ──
  // product yüklendiğinde, o ürün için daha önce saymadıysak viewCount'u +1 patch'le.
  useEffect(() => {
    if (!product?.id) return;
    if (countedProductId.current == product.id) return; // bu ürün için zaten sayıldı
    countedProductId.current = product.id;

    const nextCount = Number(product.viewCount ?? 0) + 1;
    patchProduct.mutate({ id: product.id, payload: { viewCount: nextCount } } as any);
    // eslint-disable-next-line
  }, [product?.id]);

  const variants = useMemo(
    () => (allVariants ?? []).filter((v) => v.wGProductId == productId),
    [allVariants, productId]
  );
  const variantTypes = useMemo(
    () => (allVariantTypes ?? []).filter((t) => t.wGProductId == productId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [allVariantTypes, productId]
  );
  const optionsByType = useMemo(() => {
    const map: Record<number, IVariantOption[]> = {};
    (allVariantOptions ?? []).forEach((o) => {
      if (!map[o.wGVariantTypeId]) map[o.wGVariantTypeId] = [];
      map[o.wGVariantTypeId].push(o);
    });
    Object.values(map).forEach(arr => arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    return map;
  }, [allVariantOptions]);

  const categoryName = useMemo(() => {
    if (!product) return "—";
    return (categories ?? []).find((c) => c.id == product.wGProductCategoryId)?.name ?? "—";
  }, [categories, product]);

  const stockForOption = (value: string) => {
    const matches = variants.filter((v) =>
      (v.combination ?? "").toLowerCase().includes(value.toLowerCase()));
    return matches.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  };

  const selectedVariant = useMemo(() => {
    if (variants.length == 0) return null;
    if (variantTypes.length == 0) return variants[0];
    const chosen = variantTypes.map((t) => selectedOptions[t.id]).filter(Boolean);
    if (chosen.length < variantTypes.length) return null;
    return variants.find((v) => {
      const combo = (v.combination ?? "").toLowerCase();
      return chosen.every((val) => combo.includes(String(val).toLowerCase()));
    }) ?? null;
  }, [variants, variantTypes, selectedOptions]);

  const displayPrice = useMemo(() => {
    if (selectedVariant) return selectedVariant.price;
    const prices = variants.map((v) => Number(v.price)).filter((n) => !isNaN(n));
    return prices.length ? Math.min(...prices) : null;
  }, [selectedVariant, variants]);

  const displayStock = selectedVariant ? selectedVariant.stock : null;

  const hasDiscount = !!selectedVariant && (selectedVariant.discountPercent ?? 0) > 0;
  const discountedPrice = useMemo(() => {
    if (!selectedVariant) return null;
    const dp = selectedVariant.discountPercent ?? 0;
    if (dp <= 0) return null;
    return Math.round((Number(selectedVariant.price) || 0) * (1 - dp / 100) * 100) / 100;
  }, [selectedVariant]);

  const galleryImgs = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.mainImage) { const u = resolveImg(product.mainImage); if (u) imgs.push(u); }
    if (product.gallery) {
      product.gallery.split(",").map(s => s.trim()).filter(Boolean).forEach((g) => {
        const u = resolveImg(g); if (u) imgs.push(u);
      });
    }
    return imgs;
  }, [product]);

  const selectOption = (typeId: number, value: string) =>
    setSelectedOptions((prev) => ({ ...prev, [typeId]: value }));

  const allAxesSelected =
    variantTypes.length == 0 || variantTypes.every((t) => selectedOptions[t.id]);
  const canAddToCart =
    !!selectedVariant && (selectedVariant.stock ?? 0) > 0 && allAxesSelected;

  const handleAddToCart = () => {
    if (!selectedVariant) { toast.error("Lütfen tüm seçenekleri belirleyin."); return; }
    if ((selectedVariant.stock ?? 0) <= 0) { toast.error("Bu varyant stokta yok."); return; }
    if (quantity > (selectedVariant.stock ?? 0)) {
      toast.error(`En fazla ${selectedVariant.stock} adet ekleyebilirsiniz.`); return;
    }
    if (!usr?.id) { toast.error("Sepete eklemek için giriş yapmalısınız."); return; }

    const existing = (cartRows ?? []).find(
      (c) =>
        c.userId == usr.id &&
        c.wGProductId == product?.id &&
        c.wGProductVariantId == selectedVariant.id
    );

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > (selectedVariant.stock ?? 0)) {
        toast.error(`Sepette zaten ${existing.quantity} adet var. En fazla ${selectedVariant.stock} adet ekleyebilirsiniz.`);
        return;
      }
      updateCartRow.mutate(
        { id: existing.id, payload: { quantity: newQty } } as any,
        {
          onSuccess: () => toast.success(`Sepet güncellendi: ${product?.name} (${selectedVariant.combination}) x${newQty}`),
          onError: () => toast.error("Sepet güncellenemedi."),
        }
      );
    } else {
      createCartRow.mutate(
        {
          wGProductId: product?.id,
          wGProductVariantId: selectedVariant.id,
          quantity,
          addedAt: new Date().toISOString(),
        } as any,
        {
          onSuccess: () => toast.success(`Sepete eklendi: ${product?.name} (${selectedVariant.combination}) x${quantity}`),
          onError: (e) => toast.error("Sepete eklenemedi."),
        }
      );
    }
  };

  // Açılışta her eksende ilk stokta olan seçeneği seç
  useEffect(() => {
    if (variantTypes.length == 0) return;
    if (Object.keys(selectedOptions).length > 0) return;
    const defaults: Record<number, string> = {};
    variantTypes.forEach((type) => {
      const opts = optionsByType[type.id] ?? [];
      const inStock = opts.find((o) => stockForOption(o.value) > 0);
      const pick = inStock ?? opts[0];
      if (pick) defaults[type.id] = pick.value;
    });
    if (Object.keys(defaults).length > 0) setSelectedOptions(defaults);
    // eslint-disable-next-line
  }, [variantTypes, optionsByType, variants]);

    const productFeatures = useMemo(
    () => (features ?? [])
      .filter((f) => f.wGProductId == productId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [features, productId]
  );
  const productServices = useMemo(
    () => (services ?? [])
      .filter((s) => s.wGProductId == productId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [services, productId]
  );
  const colorType = variantTypes.find((t) => (t.displayType ?? "").toLowerCase().includes("color"));
  const otherTypes = variantTypes.filter((t) => t.id !== colorType?.id);

  const { isDark } = useThemeMode();


  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }
  if (!product) {
    return (
      <div className="page-content"><Container fluid>
        <div className="py-5 text-center">
          <i className="ri-error-warning-line display-5 text-muted" />
          <h5 className="mt-3">Ürün bulunamadı</h5>
        </div>
      </Container></div>
    );
  }

  return (
    <div className="page-content">
      <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
      <Container fluid>
        <BreadCrumb title="Ürün Detayları" pageTitle={brand?.companyName || "Workgrid"} />

        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <Row className="gx-lg-5">
                  {/* ── Galeri ── */}
                  <Col xl={4} md={8} className="mx-auto">
                    <div className="product-img-slider sticky-side-div">
                      <Swiper navigation={true} thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className={`swiper product-thumbnail-slider p-2 rounded bg-${isDark ?"dark":"light"}`}>
                        <div className="swiper-wrapper">
                          {galleryImgs.length > 0 ? galleryImgs.map((img, i) => (
                            <SwiperSlide key={i}>
                              <Image src={img} className="img-fluid d-block" alt="basic"
                                onError={(e) => { e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg"; e.currentTarget.onerror = null; }} />
                            </SwiperSlide>
                          )) : (
                            <SwiperSlide>
                              <div className="d-flex align-items-center justify-content-center" style={{ height: 300 }}>
                                <i className="ri-image-line display-3 text-muted" />
                              </div>
                            </SwiperSlide>
                          )}
                        </div>
                      </Swiper>
                      {galleryImgs.length > 1 && (
                        <div className="product-nav-slider mt-2">
                          <Swiper onSwiper={setThumbsSwiper} slidesPerView={4} freeMode={true}
                            watchSlidesProgress={true} spaceBetween={10}
                            className="swiper product-nav-slider mt-2 overflow-hidden">
                            <div className="swiper-wrapper">
                              {galleryImgs.map((img, i) => (
                                <SwiperSlide className="rounded" key={i}>
                                  <div className="nav-slide-item">
                                    <Image src={img} preview={false} className="img-fluid d-block rounded" alt="basic"
                                      onError={(e) => { e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg"; e.currentTarget.onerror = null; }} />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </div>
                          </Swiper>
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* ── Ürün bilgisi ── */}
                  <Col xl={8}>
                    <div className="mt-xl-0 mt-5">
                      {/* Başlık */}
                      <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                          <h4 className="mb-1">{product.name}</h4>
                          <div className="hstack gap-3 flex-wrap">
                            {product.brand && (<>
                              <Link to="#" className="text-primary">{product.brand}</Link>
                              <div className="vr"></div>
                            </>)}
                            <span className="text-muted">Kategori: <span className="text-body fw-medium">{categoryName}</span></span>
                            {product.publishedDate && (<>
                              <div className="vr"></div>
                              <span className="text-muted">{moment(product.publishedDate).format("DD MMM, Y")}</span>
                            </>)}
                          </div>
                        </div>
                        { isAdmin &&
                          <Link to={`/edit-product/${product.id}`} className={`btn btn-${isDark ?"soft-":""}light btn-icon`}>
                            <i className={`ri-pencil-fill ${isDark ?"text-light":""}`}></i>
                          </Link>
                        }
                      </div>

                      {/* Rating */}
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <div className="text-warning fs-15">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`mdi mdi-star${i < Math.round(rating?.average ?? 0) ? "" : "-outline text-muted"}`}></i>
                          ))}
                        </div>
                        <span className="text-muted fs-13">{rating?.average ?? 0} · {rating?.count ?? 0} yorum</span>
                      </div>
                      {/* Fiyat blok */}
                      <div className={`bg-${isDark ?"dark":"light"} rounded p-3 mt-3`}>
                        <div className="d-flex align-items-center flex-wrap gap-3">
                          {hasDiscount ? (
                            <>
                              <h3 className="mb-0 text-primary">{formatPrice(discountedPrice)}</h3>
                              <del className="text-muted fs-16 mb-0">
                                {formatPrice(selectedVariant?.price)}
                              </del>
                              <span className="badge bg-danger-subtle text-danger fs-12">
                                %{selectedVariant?.discountPercent} İndirim
                              </span>
                            </>
                          ) : (
                            <h3 className="mb-0 text-primary">
                              {displayPrice != null ? formatPrice(displayPrice) : "—"}
                            </h3>
                          )}
                          {!selectedVariant && variants.length > 0 && variantTypes.length > 0 && (
                            <span className="text-muted fs-13">başlayan fiyat</span>
                          )}
                          {displayStock != null && (
                            <span className={`badge ${displayStock > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"} fs-12`}>
                              {displayStock > 0 ? `${displayStock} adet stokta` : "Tükendi"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bilgi kutuları (dinamik) */}
                      <Row className="mt-3 g-2">
                        <Col lg={3} sm={6}>
                          <div className="p-2 border border-dashed rounded h-100">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-primary fs-22">
                                  <i className="ri-stack-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p className="text-muted mb-1 fs-13">Varyant</p>
                                <h6 className="mb-0">{variants.length} adet</h6>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="p-2 border border-dashed rounded h-100">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-primary fs-22">
                                  <i className="ri-archive-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p className="text-muted mb-1 fs-13">Toplam Stok</p>
                                <h6 className="mb-0">
                                  {variants.reduce((s, v) => s + (Number(v.stock) || 0), 0)}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="p-2 border border-dashed rounded h-100">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-primary fs-22">
                                  <i className="ri-price-tag-3-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p className="text-muted mb-1 fs-13">Kategori</p>
                                <h6 className="mb-0">{categoryName}</h6>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col lg={3} sm={6}>
                          <div className="p-2 border border-dashed rounded h-100">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-primary fs-22">
                                  <i className="ri-eye-fill"></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p className="text-muted mb-1 fs-13">Görüntülenme</p>
                                <h6 className="mb-0">{Number(product.viewCount ?? 0)}</h6>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {/* ── Varyant seçimi: Beden (kare) + Renk (swatch) ── */}
                      {variantTypes.length > 0 && (
                        <div className="mt-4">
                          {/* Renk dışı eksenler — kare butonlar */}
                          {otherTypes.map((type) => {
                            const opts = optionsByType[type.id] ?? [];
                            return (
                              <div className="mb-3" key={type.id}>
                                <h6 className="fs-14 mb-2">{type.name}</h6>
                                <div className="d-flex flex-wrap gap-2">
                                  {opts.map((opt) => {
                                    const selected = selectedOptions[type.id] == opt.value;
                                    const stk = stockForOption(opt.value);
                                    const disabled = stk <= 0;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => selectOption(type.id, opt.value)}
                                        title={disabled ? "Stokta yok" : `${stk} adet`}
                                        className={`btn ${selected ? "btn-primary" : "btn-outline-primary"} ${disabled ? "opacity-50" : ""}`}
                                        style={{ minWidth: 48, height: 40, position: "relative", textDecoration: disabled ? "line-through" : "none" }}
                                      >
                                        {opt.value}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}

                          {/* Renk ekseni — swatch */}
                          {colorType && (
                            <div className="mb-3">
                              <h6 className="fs-14 mb-2">{colorType.name}</h6>
                              <div className="d-flex flex-wrap gap-2">
                                {(optionsByType[colorType.id] ?? []).map((opt) => {
                                  const selected = selectedOptions[colorType.id] == opt.value;
                                  const stk = stockForOption(opt.value);
                                  const disabled = stk <= 0;
                                  const isWhite = (opt.colorHex ?? "").toLowerCase() == "#ffffff";
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      disabled={disabled}
                                      onClick={() => selectOption(colorType.id, opt.value)}
                                      title={`${opt.value}${disabled ? " · Stokta yok" : ` · ${stk} adet`}`}
                                      className="btn p-0 position-relative d-flex align-items-center justify-content-center"
                                      style={{
                                        width: 38, height: 38, borderRadius: "50%",
                                        background: opt.colorHex ?? "#ccc",
                                        border: isWhite ? "1px solid #ddd" : "none",
                                        boxShadow: selected ? "0 0 0 2px #fff, 0 0 0 4px var(--vz-primary)" : "none",
                                        opacity: disabled ? 0.4 : 1,
                                      }}
                                    >
                                      {selected && (
                                        <i className="ri-check-line" style={{ color: isWhite ? "#000" : "#fff", fontSize: 16 }} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}


                      {/* Adet + Sepete Ekle */}
                      <div className="d-flex flex-wrap align-items-end gap-3 mt-4">
                        <div>
                          <div className="input-step">
                            <button type="button" className="minus" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>–</button>
                            <Input type="number" className="product-quantity" value={quantity} min={1}
                              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                              style={{ width: 70, textAlign: "center" }} />
                            <button type="button" className="plus" onClick={() => setQuantity((q) => q + 1)}>+</button>
                          </div>
                        </div>
                        <div>
                           {/* Seçilen varyant */}
                          {selectedVariant && (
                            <div className="text-muted fs-13">
                              Seçilen: <span className="fw-medium text-body">{selectedVariant.combination}</span>
                            </div>
                          )}
                          <button type="button" className="btn btn-primary btn-lg" disabled={!canAddToCart} onClick={handleAddToCart}>
                            <i className="ri-shopping-cart-fill align-bottom me-1"></i> Sepete Ekle
                          </button>
                        </div>
                        <div
                          className="btn btn-soft-danger btn-lg"
                          onClick={toggleFavorite}
                        >
                          <i className={`align-bottom ${existingFavorite ? "ri-heart-fill" : "ri-heart-line"}`}></i>
                        </div>
                      </div>
                      {!allAxesSelected && variantTypes.length > 0 && (
                        <div className="text-muted fs-13 mt-2">Tüm seçenekleri belirleyin.</div>
                      )}

                      {/* Açıklama */}
                      {product.description && (
                        <div className="mt-4 pt-3 border-top text-muted">
                          <h6 className="fs-14 text-body">Açıklama</h6>
                          <div dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                      )}
                      {/* Features / Services (dinamik) */}
                      {(productFeatures.length > 0 || productServices.length > 0) && (
                        <Row className="mt-3">
                          {productFeatures.length > 0 && (
                            <Col sm={6}>
                              <div className="mt-3">
                                <h6 className="fs-14">Özellikler</h6>
                                <ul className="list-unstyled">
                                  {productFeatures.map((f) => (
                                    <li className="py-1" key={f.id}>
                                      <i className={`${f.icon || "mdi mdi-circle-medium"} me-1 text-muted align-middle`}></i>
                                      {f.value}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </Col>
                          )}
                          {productServices.length > 0 && (
                            <Col sm={6}>
                              <div className="mt-3">
                                <h6 className="fs-14">Hizmetler</h6>
                                <ul className="list-unstyled product-desc-list">
                                  {productServices.map((s) => (
                                    <li className="py-1" key={s.id}>
                                      <i className={`${s.icon || "mdi mdi-circle-medium"} me-1 text-muted align-middle`}></i>
                                      {s.value}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </Col>
                          )}
                        </Row>
                      )}

                      {/* Spec / Details */}
                      <div className="product-content mt-4">
                        <Nav tabs className="nav-tabs-custom nav-primary">
                          <NavItem><NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab == "1" })} onClick={() => toggleCustom("1")}>Özellikler</NavLink></NavItem>
                          <NavItem><NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab == "2" })} onClick={() => toggleCustom("2")}>Detay</NavLink></NavItem>
                        </Nav>
                        <TabContent activeTab={customActiveTab} className="border border-top-0 p-4">
                          <TabPane tabId="1">
                            <div className="table-responsive">
                              <table className="table mb-0"><tbody>
                                <tr><th scope="row" style={{ width: "200px" }}>Kategori</th><td>{categoryName}</td></tr>
                                {product.brand && <tr><th scope="row">Marka</th><td>{product.brand}</td></tr>}
                                {product.manufacturer && <tr><th scope="row">Üretici</th><td>{product.manufacturer}</td></tr>}
                                {product.tags && <tr><th scope="row">Etiketler</th><td>{product.tags.split(",").map((x, i) => <span key={i} className="badge badge-soft-primary me-1">{x.trim()}</span>)}</td></tr>}
                                <tr><th scope="row">Durum</th><td>{product.status ?? "—"}</td></tr>
                              </tbody></table>
                            </div>
                          </TabPane>
                          <TabPane tabId="2">
                            <div>
                              <h6 className="mb-3">{product.name}</h6>
                              <p className="mb-3"> 
                                <i className="ri-eye-line fs-14 me-2 text-muted"></i>
                                Bu ürün {product.viewCount ?? 0} kere görüntülendi
                                </p>
                              {product.shortDescription ? <p>{product.shortDescription}</p>
                                : product.description ? <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                : <p className="text-muted">Detay bilgisi yok.</p>}
                            </div>
                          </TabPane>
                        </TabContent>
                      </div>

                      {/* Yorumlar */}
                      <div className="mt-4">
                        <h5 className="fs-15 mb-3">Değerlendirmeler</h5>
                        <SimpleBar className="pe-lg-3" style={{ maxHeight: "600px" }}>
                          <CommentList itemType={CommentItemType.Product} itemId={product.id} isRating={true} />
                        </SimpleBar>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EcommerceProductDetail;