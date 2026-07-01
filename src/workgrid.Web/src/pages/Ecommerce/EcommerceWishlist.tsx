import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Card, CardBody, Col, Container, Row,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";

import BreadCrumb from "components/Common/BreadCrumb";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import config from "config";

import { useGridbaseAll, useDeleteRow, useCreateRow } from "hooks/useGridBase";
import { IFavorite, IProduct, IProductVariant } from "common/data/ecommerce";
import { ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE, FAVORITE_TABLE, CART_TABLE } from "common/data/constans";
import { useCommerce } from "helpers/useCommerce";

const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

interface IEnrichedFavoriteItem {
  favoriteId: number;
  productId: number;
  name: string;
  image: string;
  price: number | null;
  discountPercent: number;
  discountedPrice: number | null;
  inStock: boolean;
}

const EcommerceWishlist = () => {
  const { data: brand } = useGetBrand();
  document.title = "Wishlist | " + (brand?.companyName || "Workgrid");

  // Ticaret ayarları (para birimi)
  const { formatPrice } = useCommerce();

  const { data: favoriteRows, isLoading: isFavLoading } = useGridbaseAll<IFavorite>(FAVORITE_TABLE);
  const { data: products, isLoading: isProductsLoading } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants, isLoading: isVariantsLoading } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);

  const removeFavorite = useDeleteRow(FAVORITE_TABLE);
  const createCartRow = useCreateRow(CART_TABLE);

  const isLoading = isFavLoading || isProductsLoading || isVariantsLoading;

  const items: IEnrichedFavoriteItem[] = useMemo(() => {
    return (favoriteRows ?? []).map((f) => {
      const product = (products ?? []).find((p) => p.id == f.wGProductId);
      const productVariants = (variants ?? []).filter((v) => v.wGProductId == f.wGProductId);

      const prices = productVariants.map((v) => Number(v.price)).filter((n) => !isNaN(n));
      const price = prices.length ? Math.min(...prices) : null;

      const cheapest = productVariants.find((v) => Number(v.price) == price);
      const discountPercent = Number(cheapest?.discountPercent ?? 0);
      const discountedPrice = price != null && discountPercent > 0
        ? Math.round(price * (1 - discountPercent / 100) * 100) / 100
        : null;

      const totalStock = productVariants.reduce((s, v) => s + (Number(v.stock) || 0), 0);

      return {
        favoriteId: f.id,
        productId: f.wGProductId,
        name: product?.name ?? "Ürün",
        image: resolveImg(product?.mainImage),
        price,
        discountPercent,
        discountedPrice,
        inStock: totalStock > 0,
      };
    });
  }, [favoriteRows, products, variants]);

  const handleRemove = (favoriteId: number) => {
    removeFavorite.mutate(favoriteId, {
      onSuccess: () => toast.success("Favorilerden kaldırıldı."),
      onError: () => toast.error("Kaldırılamadı."),
    });
  };

  const handleAddToCart = (item: IEnrichedFavoriteItem) => {
    if (!item.inStock) {
      toast.error("Bu ürün şu an stokta yok.");
      return;
    }
    createCartRow.mutate(
      {
        wGProductId: item.productId,
        wGProductVariantId: null,
        quantity: 1,
        addedAt: new Date().toISOString(),
      } as any,
      {
        onSuccess: () => toast.success(`Sepete eklendi: ${item.name}`),
        onError: () => toast.error("Sepete eklenemedi."),
      }
    );
  };

  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}} />
        <Container fluid>
          <BreadCrumb title="Favoriler" pageTitle={brand?.companyName || "Workgrid"} />

          <Row className="align-items-center gy-3 mb-3">
            <div className="col-sm">
              <h5 className="fs-14 mb-0">Favorilerim ({items.length})</h5>
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
                <i className="ri-heart-line display-4 text-muted" />
                <h5 className="mt-3">Favori listeniz boş</h5>
                <p className="text-muted">Beğendiğiniz ürünleri kalp ikonuna tıklayarak buraya ekleyebilirsiniz.</p>
                <Link to="/ecommerce-products" className="btn btn-primary mt-2">
                  Alışverişe Başla
                </Link>
              </CardBody>
            </Card>
          ) : ( 
            <Row className="gy-3 gx-3">
              {items.map((item) => (
                <Col xs={12} key={item.favoriteId}>
                  <Card className="product border border-2 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0" style={{ width: "120px" }}>
                        <Link to={`/product-detail/${item.productId}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid"
                            style={{ height: "120px", objectFit: "cover", width: "100%" }}
                            onError={(e) => {
                              e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                              e.currentTarget.onerror = null;
                            }}
                          />
                        </Link>
                      </div>

                      {/* İçerik Alanı */}
                      <CardBody className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="fs-14 mb-1">
                            <Link to={`/product-detail/${item.productId}`} className="text-body">
                              {item.name}
                            </Link>
                          </h5>
                          <button
                            type="button"
                            className="btn btn-sm btn-soft-danger btn-icon"
                            onClick={() => handleRemove(item.favoriteId)}
                          >
                            <i className="ri-heart-fill"></i>
                          </button>
                        </div>

                        <div className="d-flex align-items-center gap-2 mt-2">
                          {item.discountPercent > 0 && item.discountedPrice != null ? (
                            <>
                              <span className="fs-15 fw-semibold text-primary">{formatPrice(item.discountedPrice)}</span>
                              <del className="text-muted fs-13">{formatPrice(item.price)}</del>
                            </>
                          ) : (
                            <span className="fs-15 fw-semibold text-primary">{item.price != null ? formatPrice(item.price) : "—"}</span>
                          )}
                        </div>
                        
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            disabled={!item.inStock}
                            onClick={() => handleAddToCart(item)}
                          >
                            <i className="ri-shopping-cart-fill align-bottom me-1"></i> Sepete Ekle
                          </button>
                        </div>
                      </CardBody>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceWishlist;