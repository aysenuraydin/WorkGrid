import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Card, CardBody, Col, Container, Input, Row, CardHeader, UncontrolledAlert,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";

import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import { useAuth } from "context/AuthContext";
import config from "config";

import { useGridbaseAll, useDeleteRow, useUpdateRow, usePatchRow, useCreateRow } from "hooks/useGridBase";
import { ICart, IProduct, IProductVariant, IFavorite } from "common/data/ecommerce";
import { ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE, CART_TABLE, FAVORITE_TABLE } from "common/data/constans";
import { useCommerce } from "helpers/useCommerce";

const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

interface IEnrichedCartItem {
  cartId: number;
  productId: number;
  variantId: number;
  name: string;
  combination: string;
  image: string;
  quantity: number;
  stock: number;
  unitPrice: number;
  discountPercent: number;
  discountedUnitPrice: number;
}

const EcommerceCart = () => {
  const { data: brand } = useGetBrand();
  document.title = "Shopping Cart | " + (brand?.companyName || "Workgrid");

  const { currency, shippingFee, formatPrice } = useCommerce();

  const { user: usr } = useAuth();
  const { data: cartRows, isLoading: isCartLoading } = useGridbaseAll<ICart>(CART_TABLE);
  const { data: products, isLoading: isProductsLoading } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants, isLoading: isVariantsLoading } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const { data: favoriteRows } = useGridbaseAll<IFavorite>(FAVORITE_TABLE);

  const del = useDeleteRow(CART_TABLE);
  const update = usePatchRow(CART_TABLE);
  const createFavorite = useCreateRow(FAVORITE_TABLE);
  const deleteFavorite = useDeleteRow(FAVORITE_TABLE);

  // Hızlı arama için productId -> favorite map'i
  const favoriteByProductId = useMemo(() => {
    const map: Record<number, IFavorite> = {};
    (favoriteRows ?? []).forEach((f) => {
      map[Number(f.wGProductId)] = f;
    });
    return map;
  }, [favoriteRows]);

  const toggleFavorite = (productId: number) => {
    if (!usr?.id) { toast.error("Favorilere eklemek için giriş yapmalısınız."); return; }

    const existing = favoriteByProductId[Number(productId)];
    if (existing) {
      deleteFavorite.mutate(existing.id, {
        onSuccess: () => toast.success("Favorilerden kaldırıldı."),
        onError: () => toast.error("Favorilerden kaldırılamadı."),
      });
    } else {
      createFavorite.mutate(
        { wGProductId: productId, addedAt: new Date().toISOString() } as any,
        {
          onSuccess: () => toast.success("Favorilere eklendi."),
          onError: () => toast.error("Favorilere eklenemedi."),
        }
      );
    }
  };

  const isLoading = isCartLoading || isProductsLoading || isVariantsLoading;

  // Sadece bu kullanıcının sepet satırları
  const myCartRows = useMemo(
    () => (cartRows ?? []).filter((c) => true),
    [cartRows, usr]
  );

  // Cart satırlarını ürün + varyant bilgisiyle zenginleştir
  const items: IEnrichedCartItem[] = useMemo(() => {
    return myCartRows.map((c) => {
      const product = (products ?? []).find((p) => p.id == c.wGProductId);
      const variant = (variants ?? []).find((v) => v.id == c.wGProductVariantId);

      const unitPrice = Number(variant?.price ?? 0);
      const discountPercent = Number(variant?.discountPercent ?? 0);
      const discountedUnitPrice = discountPercent > 0
        ? Math.round(unitPrice * (1 - discountPercent / 100) * 100) / 100
        : unitPrice;

      const image = variant?.variantImage
        ? resolveImg(variant.variantImage)
        : resolveImg(product?.mainImage);

      return {
        cartId: c.id,
        productId: c.wGProductId,
        variantId: c.wGProductVariantId,
        name: product?.name ?? "Ürün",
        combination: variant?.combination ?? "",
        image,
        quantity: c.quantity,
        stock: variant?.stock ?? 0,
        unitPrice,
        discountPercent,
        discountedUnitPrice,
      };
    });
  }, [myCartRows, products, variants]);

  // ── Toplamlar ──
  const subTotal = useMemo(
    () => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    [items]
  );
  const discountTotal = useMemo(
    () => items.reduce((s, i) => s + (i.unitPrice - i.discountedUnitPrice) * i.quantity, 0),
    [items]
  );
  const afterDiscount = subTotal - discountTotal;
  const charge = items.length > 0 ? shippingFee : 0;
  const grandTotal = Math.round((afterDiscount + charge) * 100) / 100;

  // ── Aksiyonlar ──
  const removeCartItem = (cartId: number) => {
    del.mutate(cartId, {
      onSuccess: () => toast.success("Ürün sepetten kaldırıldı."),
      onError: () => toast.error("Ürün kaldırılamadı."),
    });
  };

  const changeQuantity = (item: IEnrichedCartItem, nextQty: number) => {
    if (nextQty < 1) return;
    if (item.stock > 0 && nextQty > item.stock) {
      toast.error(`En fazla ${item.stock} adet ekleyebilirsiniz.`);
      return;
    }
    update.mutate(
      { id: item.cartId, payload: { quantity: nextQty } } as any,
      { onError: () => toast.error("Adet güncellenemedi.") }
    );
  };

  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
        <Container fluid>
          <BreadCrumb title="Alışveriş Sepetim" pageTitle={brand?.companyName || "Workgrid"} />
          <Row className="mb-3">
            <Col xl={8}>
              <Row className="align-items-center gy-3 mb-3">
                <div className="col-sm">
                  <div>
                    <h5 className="fs-14 mb-0">Sepetinizdeki Ürünler ({items.length} adet)</h5>
                  </div>
                </div>
                <div className="col-sm-auto">
                  <Link to="/ecommerce-products" className="link-primary text-decoration-underline">
                    Alışverişe Devam Et
                  </Link>
                </div>
              </Row>

              {items.length == 0 ? (
                <Card className="border border-2">
                  <CardBody className="py-5 text-center">
                    <i className="ri-shopping-cart-2-line display-4 text-muted" />
                    <h5 className="mt-3">Sepetiniz şu an boş</h5>
                    <p className="text-muted">Henüz sepete ürün eklemediniz.</p>
                    <Link to="/ecommerce-products" className="btn btn-primary mt-3">
                      Ürünleri Keşfet
                    </Link>
                  </CardBody>
                </Card>
              ) : (
                items.map((item) => {
                  const isFavorite = !!favoriteByProductId[Number(item.productId)];
                  return (
                  <Card className="product border border-2" key={item.cartId}>
                    <CardBody>
                      <Row className="gy-3">
                        <div className="col-sm-auto">
                          <div className="avatar-lg bg-light rounded p-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="img-fluid d-block"
                              onError={(e) => {
                                e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                                e.currentTarget.onerror = null;
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-sm">
                          <h5 className="fs-14 text-truncate">
                            <Link to={`/product-detail/${item.productId}`} className="text-body">
                              {item.name}
                            </Link>
                          </h5>
                          {item.combination && (
                            <ul className="list-inline text-muted">
                              <li className="list-inline-item">
                                Seçenek: <span className="fw-medium">{item.combination}</span>
                              </li>
                            </ul>
                          )}

                          <div className="input-step">
                            <button
                              type="button"
                              className="minus"
                              onClick={() => changeQuantity(item, item.quantity - 1)}
                            >
                              –
                            </button>
                            <Input
                              type="text"
                              className="product-quantity"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              type="button"
                              className="plus"
                              onClick={() => changeQuantity(item, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-sm-auto">
                          <div className="text-lg-end">
                            <p className="text-muted mb-1">Birim Fiyat:</p>
                            {item.discountPercent > 0 ? (
                              <>
                                <h5 className="fs-14 mb-0 text-danger">
                                  <span className="product-price">{formatPrice(item.discountedUnitPrice)}</span>
                                </h5>
                                <small className="text-muted text-decoration-line-through">
                                  {formatPrice(item.unitPrice)}
                                </small>{" "}
                                <span className="badge bg-danger-subtle text-danger fs-11">
                                  %{item.discountPercent} İndirim
                                </span>
                              </>
                            ) : (
                              <h5 className="fs-14">
                                <span className="product-price">{formatPrice(item.unitPrice)}</span>
                              </h5>
                            )}
                          </div>
                        </div>
                      </Row>
                    </CardBody>

                    <div className="card-footer">
                      <div className="row align-items-center gy-3">
                        <div className="col-sm">
                          <div className="d-flex flex-wrap my-n1">
                            <div>
                              <Link
                                to="#"
                                className="d-block text-body p-1 px-2"
                                onClick={() => removeCartItem(item.cartId)}
                              >
                                <i className="ri-delete-bin-fill text-muted align-bottom me-1"></i> Kaldır
                              </Link>
                            </div>
                            <div>
                              <Link
                                to="#"
                                className="d-block text-body p-1 px-2"
                                onClick={(e) => { e.preventDefault(); toggleFavorite(item.productId); }}
                              >
                                <i className={`align-bottom me-1 ${isFavorite ? "ri-heart-fill text-danger" : "ri-heart-line text-muted"}`}></i>{" "}
                                {isFavorite ? "Favorilerde" : "Favorilere Ekle"}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-auto">
                          <div className="d-flex align-items-center gap-2 text-muted">
                            <div>Toplam:</div>
                            <h5 className="fs-14 mb-0">
                              <span className="product-line-price">
                                {formatPrice(item.discountedUnitPrice * item.quantity)}
                              </span>
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  );
                })
              )}

              {items.length > 0 && (
                <div className="text-end mb-4">
                  <Link to="/checkout" className="btn btn-primary btn-label right ms-auto">
                    <i className="ri-arrow-right-line label-icon align-bottom fs-16 ms-2"></i>{" "}
                    Ödemeye Geç
                  </Link>
                </div>
              )}
            </Col>

            <Col xl={4}>
              <div className="sticky-side-div">
                <Card className="border border-2">
                  <CardHeader className="border-bottom-dashed">
                    <h5 className="card-title mb-0">Sipariş Özeti</h5>
                  </CardHeader>
                  <CardHeader className="bg-light-subtle border-bottom-dashed">
                    <div className="text-center">
                      <h6 className="mb-2">
                        Kupon kodunuz mu var?
                      </h6>
                    </div>
                    <div className="hstack gap-3 px-3 mx-n3">
                      <input
                        className="form-control me-auto"
                        type="text"
                        placeholder="Kupon kodu girin"
                      />
                      <button type="button" className="btn btn-primary w-xs">
                        Uygula
                      </button>
                    </div>
                  </CardHeader>
                  <CardBody className="pt-2">
                    <div className="table-responsive">
                      <table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td>Ara Toplam :</td>
                            <td className="text-end">{formatPrice(subTotal)}</td>
                          </tr>
                          <tr>
                            <td>İndirim :</td>
                            <td className="text-end text-danger">- {formatPrice(discountTotal)}</td>
                          </tr>
                          <tr>
                            <td>Kargo Ücreti :</td>
                            <td className="text-end">{formatPrice(charge)}</td>
                          </tr>
                          <tr className="table-active">
                            <th>Genel Toplam ({currency}) :</th>
                            <td className="text-end">
                              <span className="fw-semibold">{formatPrice(grandTotal)}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceCart;