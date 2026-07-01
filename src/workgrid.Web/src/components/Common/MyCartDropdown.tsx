import React, { useMemo, useState } from 'react';
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import SimpleBar from "simplebar-react";
import { toast } from "react-toastify";

import { useGridbaseAll, useDeleteRow } from "hooks/useGridBase";
import { ICart, IProduct, IProductVariant } from "common/data/ecommerce";
import { ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE, CART_TABLE } from "common/data/constans";
import config from "config";
import { useCommerce } from 'helpers/useCommerce';

const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const MyCartDropdown = () => {
  const [isCartDropdown, setIsCartDropdown] = useState(false);

  const { shippingFee, formatPrice } = useCommerce();

  const { data: cartRows, isLoading: isCartLoading } = useGridbaseAll<ICart>(CART_TABLE);
  const { data: products } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);

  const del = useDeleteRow(CART_TABLE);

  const items = useMemo(() => {
    return (cartRows ?? []).map((c) => {
      const product = (products ?? []).find((p) => p.id === c.wGProductId);
      const variant = (variants ?? []).find((v) => v.id === c.wGProductVariantId);

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
        name: product?.name ?? "Ürün",
        combination: variant?.combination ?? "",
        image,
        quantity: c.quantity,
        unitPrice,
        discountedUnitPrice,
        lineTotal: discountedUnitPrice * c.quantity,
      };
    });
  }, [cartRows, products, variants]);

    const afterDiscount = useMemo(
    () => items.reduce((s, i) => s + i.discountedUnitPrice * i.quantity, 0),
    [items]
    );
    const charge = items.length > 0 ? shippingFee : 0;
    const grandTotal = Math.round((afterDiscount + charge) * 100) / 100;

  const removeItem = (cartId: number) => {
    del.mutate(cartId, {
      onSuccess: () => toast.success("Ürün sepetten kaldırıldı."),
      onError: () => toast.error("Ürün kaldırılamadı."),
    });
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isCartDropdown}
        toggle={() => setIsCartDropdown(!isCartDropdown)}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
          <i className='bx bx-shopping-bag fs-22'></i>
          <span className="position-absolute cartitem-badge topbar-badge fs-10 translate-middle badge rounded-pill bg-info">
            {items.length}
            <span className="visually-hidden">unread messages</span>
          </span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart" aria-labelledby="page-header-cart-dropdown">
          <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0 fs-16 fw-semibold">My Cart</h6>
              </Col>
              <div className="col-auto">
                <span className="badge bg-warning-subtle text-warning fs-13">
                  {items.length} items
                </span>
              </div>
            </Row>
          </div>
          
          <SimpleBar style={{ maxHeight: "300px" }}>
            <div className="p-2">
              {items.length === 0 && (
                <div className="text-center py-4">
                  <div className="avatar-md mx-auto my-3">
                    <div className="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                      <i className='bx bx-cart'></i>
                    </div>
                  </div>
                  <h5 className="mb-3">Your Cart is Empty!</h5>
                  <Link to="/products" className="btn btn-soft-success w-md mb-3 me-2">
                    Shop Now
                  </Link>
                <Link to="/cart" className="btn btn-soft-primary mb-3 text-center w-md">
                    Sepete git
                </Link>
                </div>
              )}

              {items.map((item) => (
                <div className="d-block dropdown-item text-wrap dropdown-item-cart px-3 py-2" key={item.cartId}>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.image}
                      className="me-3 rounded-circle avatar-sm p-2 bg-light"
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.src = "https://dummyimage.com/300x300/F3F6F9/969696.jpg";
                        e.currentTarget.onerror = null;
                      }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mt-0 mb-1 fs-14">
                        <Link to={`/product-detail/${item.productId}`} className="text-reset">
                          {item.name}
                        </Link>
                      </h6>
                      <p className="mb-0 fs-12 text-muted">
                        {item.combination && <span className="me-2">({item.combination})</span>}
                        {item.quantity} x {formatPrice(item.discountedUnitPrice)}
                      </p>
                    </div>
                    <div className="px-2">
                      <h5 className="m-0 fw-normal">
                        {formatPrice(item.lineTotal)}
                      </h5>
                    </div>
                    <div className="ps-2">
                      <button
                        type="button"
                        className="btn btn-icon btn-sm btn-ghost-secondary"
                        onClick={() => removeItem(item.cartId)}
                      >
                        <i className="ri-close-fill fs-16"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SimpleBar>

          {items.length > 0 && (
            <div className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border" id="checkout-elem">
                <div className="d-flex justify-content-between align-items-center pb-3">
                    <h5 className="m-0 text-muted">Total:</h5>
                    <div className="px-2">
                    <h5 className="m-0">{formatPrice(grandTotal)}</h5>
                    </div>
                </div>
                <Link to="/checkout" className="btn btn-soft-success text-center w-100">
                    Checkout
                </Link>
                <Link to="/cart" className="btn btn-soft-primary mt-2 text-center w-100">
                    Sepete git
                </Link>
            </div>
          )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default MyCartDropdown;