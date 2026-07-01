import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Input } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";

import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import config from "config";
import { Image } from "antd";
import { useGridbaseAll } from "hooks/useGridBase";
import { IProduct, IProductVariant, IOrder } from "common/data/ecommerce";
import { ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE, ORDER_TABLE } from "common/data/constans";
import { useCommerce } from "helpers/useCommerce";
import Footer from "Layouts/Footer";
import useThemeMode from "hooks/useThemeMode";

const resolveImg = (name?: string | null) =>
  !name
    ? "https://dummyimage.com/600x600/F8F9FA/CED4DA.jpg"
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

interface IParsedOrderItem { productId?: number; quantity?: number; }

const safeParseItems = (raw?: string): IParsedOrderItem[] => {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
};

const isVisible = (p: IProduct) =>
  (p.status ?? "").toLowerCase() == "published" &&
  (p.visibility ?? "public").toLowerCase() !== "hidden";

const EcommerceHome = () => {
  const { data: brand } = useGetBrand();
  const { isDark } = useThemeMode();
  document.title = "Mağaza | " + (brand?.companyName || "Workgrid");

  const { formatPrice } = useCommerce();

  const { data: products, isLoading } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: variants } = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const { data: orders } = useGridbaseAll<IOrder>(ORDER_TABLE);

  const [search, setSearch] = useState("");

  const visibleProducts = useMemo(() => (products ?? []).filter(isVisible), [products]);

  const priceByProduct = useMemo(() => {
    const map: Record<number, { price: number | null; discounted: number | null; discountPercent: number }> = {};
    visibleProducts.forEach((p) => {
      const pv = (variants ?? []).filter((v) => v.wGProductId == p.id);
      const prices = pv.map((v) => Number(v.price)).filter((n) => !isNaN(n));
      const price = prices.length ? Math.min(...prices) : null;
      const cheapest = pv.find((v) => Number(v.price) == price);
      const dp = Number(cheapest?.discountPercent ?? 0);
      const discounted = price != null && dp > 0 ? Math.round(price * (1 - dp / 100) * 100) / 100 : null;
      map[Number(p.id)] = { price, discounted, discountPercent: dp };
    });
    return map;
  }, [visibleProducts, variants]);

  const bestSellers = useMemo(() => {
    const soldQty: Record<number, number> = {};
    (orders ?? []).forEach((o) => {
      if (o.status == "cancelled" || o.status == "returns") return;
      safeParseItems(o.items).forEach((it) => {
        if (it.productId == null) return;
        soldQty[Number(it.productId)] = (soldQty[Number(it.productId)] ?? 0) + (Number(it.quantity) || 0);
      });
    });
    return visibleProducts
      .map((p) => ({ product: p, sold: soldQty[Number(p.id)] ?? 0 }))
      .filter((x) => x.sold > 0)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)
      .map((x) => x.product);
  }, [visibleProducts, orders]);

  const newest = useMemo(() =>
    [...visibleProducts]
      .sort((a, b) => {
        const da = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const db = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return db - da;
      })
      .slice(0, 20),
    [visibleProducts]
  );

  const mostViewed = useMemo(() =>
    [...visibleProducts]
      .filter((p) => Number((p as any).viewCount ?? 0) > 0)
      .sort((a, b) => Number((b as any).viewCount ?? 0) - Number((a as any).viewCount ?? 0))
      .slice(0, 10),
    [visibleProducts]
  );

  const featured = useMemo(
    () => bestSellers[0] ?? mostViewed[0] ?? newest[0] ?? null,
    [bestSellers, mostViewed, newest]
  );

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return visibleProducts.filter((p) =>
      (p.name ?? "").toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q) ||
      (p.tags ?? "").toLowerCase().includes(q)
    );
  }, [search, visibleProducts]);

  // ── Minimal ürün kartı ──
  const ProductCard = ({ product }: { product: IProduct }) => {
    const info = priceByProduct[Number(product.id)] ?? { price: null, discounted: null, discountPercent: 0 };

    return (
      <Link to={`/product-detail/${product.id}`} className="hp-card text-decoration-none">
        <div className="hp-card-imgwrap">
          <img
            src={resolveImg(product.mainImage)}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = "https://dummyimage.com/600x600/F8F9FA/CED4DA.jpg"; e.currentTarget.onerror = null; }}
          />
          {info.discountPercent > 0 && <span className="hp-badge">%{info.discountPercent}</span>}
        </div>
        <div className="hp-card-body">
          <div className="hp-card-name">{product.name}</div>
          {product.brand && <div className="hp-card-brand">{product.brand}</div>}
          <div className="hp-card-price">
            {info.discounted != null ? (
              <>
                <span className="hp-price-now">{formatPrice(info.discounted)}</span>
                <span className="hp-price-old">{formatPrice(info.price)}</span>
              </>
            ) : (
              <span className="hp-price-now">{info.price != null ? formatPrice(info.price) : "—"}</span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  // ── Yatay kayan ürün şeridi ──
  const ProductRail = ({ eyebrow, title, items }: { eyebrow: string; title: string; items: IProduct[] }) => {
    if (items.length == 0) return null;
    return (
      <section className="hp-section">
        <div className="hp-section-head">
          <span className="hp-eyebrow">{eyebrow}</span>
          <h2 className="hp-section-title">{title}</h2>
        </div>
        <Swiper
          modules={[FreeMode, Navigation]}
          navigation
          freeMode
          slidesPerView={2.1}
          spaceBetween={12}
          breakpoints={{
            0:    { slidesPerView: 2.1, spaceBetween: 12 },
            420:  { slidesPerView: 2.4, spaceBetween: 14 },
            576:  { slidesPerView: 2.8, spaceBetween: 16 },
            768:  { slidesPerView: 3.5, spaceBetween: 18 },
            992:  { slidesPerView: 4.2, spaceBetween: 20 },
            1400: { slidesPerView: 5.2, spaceBetween: 20 },
          }}
          className="hp-swiper"
        >
          {items.map((p) => (
            <SwiperSlide key={p.id}><ProductCard product={p} /></SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  if (isLoading) {
    return <div className="page-content"><Container fluid><Loader isText /></Container></div>;
  }

  return (
    <div className={`page-content hp-root ${isDark ? "hp-dark" : ""}`}>
      <style>{`
        /* Açık (varsayılan) tema değişkenleri */
        .hp-root {
          --hp-ink:#1d1d1f;
          --hp-muted:#86868b;
          --hp-line:#ededed;
          --hp-card-bg:#f5f5f7;
          --hp-hero-grad: linear-gradient(180deg, #fafafa 0%, #f2f3f5 100%);
          --hp-featured-bg:#f5f5f7;
          --hp-featured-media-bg:#fff;
          --hp-search-bg:#fff;
          --hp-arrow-bg:#fff;
          --hp-shadow: rgba(0,0,0,.12);
        }
        /* Koyu tema değişkenleri — sadece bunları değiştiriyoruz, alt kurallar otomatik uyar */
        .hp-root.hp-dark {
          --hp-ink:#f1f3f5;
          --hp-muted:#9aa0a6;
          --hp-line:rgba(255,255,255,.08);
          --hp-card-bg:#1c2733;
          --hp-hero-grad: linear-gradient(180deg, #0c2138 0%, #05192F 100%);
          --hp-featured-bg:#0e1f33;
          --hp-featured-media-bg:#13263c;
          --hp-search-bg:#13263c;
          --hp-arrow-bg:#1c2733;
          --hp-shadow: rgba(0,0,0,.5);
        }

        .hp-hero {
          min-height: 460px; border-radius: 22px; overflow:hidden;
          display:flex; align-items:center;
          background:
            radial-gradient(120% 120% at 80% 20%, rgba(var(--vz-primary-rgb),.10), transparent 60%),
            var(--hp-hero-grad);
          padding: clamp(28px, 6vw, 72px);
          margin-bottom: 64px;
        }
        .hp-hero h1 {
          font-size: clamp(1.8rem, 5vw, 4rem); line-height:1.05; letter-spacing:-.03em;
          font-weight:700; color:var(--hp-ink); margin:0 0 14px;
        }
        .hp-hero p { font-size: clamp(.95rem,2vw,1.25rem); color:var(--hp-muted); margin:0 0 28px; max-width:520px; }
        .hp-search {
          display:flex; align-items:center; background:var(--hp-search-bg); border-radius:999px;
          padding:6px 6px 6px 22px; max-width:440px; box-shadow:0 1px 0 rgba(0,0,0,.04), 0 8px 30px rgba(0,0,0,.06);
        }
        .hp-search input { border:0; outline:0; flex:1; font-size:1rem; background:transparent; color:var(--hp-ink); min-width:0; }
        .hp-search input::placeholder { color:var(--hp-muted); }
        .hp-search button {
          border:0; width:42px; height:42px; border-radius:999px; flex-shrink:0;
          background:var(--vz-primary); color:#fff; font-size:1.1rem; display:flex; align-items:center; justify-content:center;
        }
        .hp-section { margin-bottom: 48px; }
        .hp-section-head { margin-bottom: 18px; }
        .hp-eyebrow {
          display:block; font-size:.72rem; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
          color:var(--vz-primary); margin-bottom:4px;
        }
        .hp-section-title { font-size: clamp(1.25rem,3vw,2.1rem); font-weight:700; letter-spacing:-.02em; color:var(--hp-ink); margin:0; }
        .hp-swiper { padding: 6px 4px 10px; }
        .hp-swiper .swiper-button-next, .hp-swiper .swiper-button-prev {
          color:var(--hp-ink); background:var(--hp-arrow-bg); width:38px; height:38px; border-radius:999px;
          box-shadow:0 4px 16px var(--hp-shadow); top:42%;
        }
        .hp-swiper .swiper-button-next:after, .hp-swiper .swiper-button-prev:after { font-size:15px; font-weight:700; }
        /* Küçük ekranda ok butonlarını gizle (parmakla kaydırma var) */
        @media (max-width: 768px){
          .hp-swiper .swiper-button-next, .hp-swiper .swiper-button-prev { display:none; }
        }
        .hp-card { display:block; color:inherit; }
        .hp-card-imgwrap {
          position:relative; aspect-ratio:1/1; border-radius:14px; overflow:hidden; background:var(--hp-card-bg);
          transition:transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s;
        }
        .hp-card-imgwrap img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .5s ease; }
        .hp-card:hover .hp-card-imgwrap { transform:translateY(-6px); box-shadow:0 18px 40px var(--hp-shadow); }
        .hp-card:hover .hp-card-imgwrap img { transform:scale(1.05); }
        .hp-badge {
          position:absolute; top:10px; left:10px; background:var(--vz-danger); color:#fff;
          font-size:.68rem; font-weight:600; padding:3px 8px; border-radius:999px;
        }
        .hp-card-body { padding:10px 2px 0; }
        .hp-card-name { font-size:.9rem; font-weight:600; color:var(--hp-ink); margin-bottom:2px; line-height:1.3;
          display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
        .hp-card-brand { font-size:.75rem; color:var(--hp-muted); margin-bottom:6px; }
        .hp-card-price { display:flex; align-items:baseline; gap:6px; flex-wrap:wrap; }
        .hp-price-now { font-size:.95rem; font-weight:600; color:var(--hp-ink); }
        .hp-price-old { font-size:.8rem; color:var(--hp-muted); text-decoration:line-through; }
        .hp-featured {
          display:grid; grid-template-columns:1.1fr 1fr; gap:0; border-radius:22px; overflow:hidden;
          background:var(--hp-featured-bg); margin-bottom:48px; min-height:380px;
        }
        .hp-featured-media { background:var(--hp-featured-media-bg); display:flex; align-items:center; justify-content:center; padding:32px; }
        .hp-featured-media img { max-width:100%; max-height:320px; object-fit:contain; }
        .hp-featured-body { padding: clamp(24px,4vw,56px); display:flex; flex-direction:column; justify-content:center; }
        .hp-featured-body .hp-eyebrow { color:var(--vz-primary); }
        .hp-featured-title { font-size:clamp(1.4rem,3vw,2.4rem); font-weight:700; letter-spacing:-.02em; color:var(--hp-ink); margin:0 0 10px; }
        .hp-featured-desc { color:var(--hp-muted); margin-bottom:22px; max-width:420px; }
        @media (max-width: 768px){
          .hp-featured{ grid-template-columns:1fr; min-height:0; }
          .hp-featured-media{ padding:20px; }
          .hp-featured-media img{ max-height:220px; }
        }
        .hp-empty { text-align:center; padding:80px 0; color:var(--hp-muted); }
        /* Arama sonuçları grid'i — küçük ekranda 2 sütun */
        .hp-search-grid {
          display:grid; gap:14px;
          grid-template-columns:repeat(2,1fr);
        }
        @media (min-width:576px){ .hp-search-grid{ grid-template-columns:repeat(3,1fr); gap:18px; } }
        @media (min-width:992px){ .hp-search-grid{ grid-template-columns:repeat(4,1fr); gap:24px; } }
        @media (min-width:1400px){ .hp-search-grid{ grid-template-columns:repeat(5,1fr); } }
      `}</style>

      <Container fluid style={{ maxWidth: 1320 }}>
        {/* ── HERO ── */}
        <div className="hp-hero">
          <div className="w-100">
            <h1>İhtiyacın olan her şey,<br />tek bir yerde.</h1>
            <p>{brand?.companyName || "Workgrid"} mağazasında en çok tercih edilen ürünleri keşfet.</p>
            <div className="hp-search">
              <input
                type="text"
                placeholder="Ürün, marka veya etiket ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button><i className="ri-search-line" /></button>
            </div>
          </div>
        </div>

        {searchResults !== null ? (
          <section className="hp-section">
            <div className="hp-section-head">
              <span className="hp-eyebrow">Arama</span>
              <h2 className="hp-section-title">“{search}” · {searchResults.length} sonuç</h2>
            </div>
            {searchResults.length == 0 ? (
              <div className="hp-empty">
                <i className="ri-search-line" style={{ fontSize: 48 }} />
                <p className="mt-3">Eşleşen ürün yok. Farklı bir arama dene.</p>
              </div>
            ) : (
              <div className="hp-search-grid">
                {searchResults.map((p) => <ProductCard product={p} key={p.id} />)}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* ── Öne çıkan tek ürün ── */}
            {featured && (() => {
              const info = priceByProduct[Number(featured.id)] ?? { price: null, discounted: null, discountPercent: 0 };
              const shown = info.discounted ?? info.price;
              return (
                <div className="hp-featured">
                  <div className="hp-featured-media">
                    <img
                      src={resolveImg(featured.mainImage)}
                      alt={featured.name}
                      onError={(e) => { e.currentTarget.src = "https://dummyimage.com/600x600/F8F9FA/CED4DA.jpg"; e.currentTarget.onerror = null; }}
                    />
                  </div>
                  <div className="hp-featured-body">
                    <span className="hp-eyebrow">Öne çıkan</span>
                    <h2 className="hp-featured-title">{featured.name}</h2>
                    <p className="hp-featured-desc">
                      {featured.shortDescription || "Bu sezonun en çok ilgi gören ürünlerinden biri."}
                    </p>
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--hp-ink)" }}>
                        {shown != null ? formatPrice(shown) : "—"}
                      </span>
                      {info.discounted != null && (
                        <span className="hp-price-old" style={{ fontSize: "1rem" }}>{formatPrice(info.price)}</span>
                      )}
                    </div>
                    <div>
                      <Link to={`/product-detail/${featured.id}`} className="btn btn-dark btn-lg rounded-pill px-4">
                        İncele <i className="ri-arrow-right-line align-bottom ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })()}

            <ProductRail eyebrow="Çok satanlar" title="Herkesin tercihi" items={bestSellers} />
            <ProductRail eyebrow="En çok incelenen" title="İlgi çekenler" items={mostViewed} />
            <ProductRail eyebrow="Yeni" title="Mağazaya yeni gelenler" items={newest} />

            {visibleProducts.length == 0 && (
              <div className="hp-empty">
                <i className="ri-store-2-line" style={{ fontSize: 56 }} />
                <p className="mt-3">Henüz yayınlanan ürün yok.</p>
              </div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default EcommerceHome;