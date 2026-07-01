import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
    Card, CardBody, Col, Container, Input, Row, Badge, Spinner,
} from "reactstrap";
import BreadCrumb from "components/Common/BreadCrumb";
import { useGetBrand } from "hooks/useBrand";
import { useTenantContext } from "context/TenantContext";
import { useGridbaseAll, useTablesAll } from "hooks/useGridBase";
import config from "config";
import { BLOG_TABLE, ECOMMERCE_TABLE } from "common/data/constans";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";

interface ITableSummary {
    id: number;
    name: string;
    rowCount?: number;
    columnCount?: number;
}
interface IBlogRow {
    id: number;
    title?: string;
    excerpt?: string;
    summary?: string;
    description?: string;
    author?: string;
    publishedDate?: string;
    mainImage?: string;
    category?: string;
}
interface IProductRow {
    id: number;
    name?: string;
    brand?: string;
    price?: number;
    discountedPrice?: number;
    stock?: number;
    mainImage?: string;
}

const BLOG_SEARCH_FIELDS = "title,description,content,tags";
const PRODUCT_SEARCH_FIELDS = "name,description,shortDescription,brand,manufacturer,tags";

const imgUrl = (name?: string | null) =>
    !name
        ? "https://dummyimage.com/300x300/F3F6F9/969696.jpg"
        : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

const formatPrice = (n?: number) =>
    n == null ? "" : new Intl.NumberFormat("tr-TR").format(n) + " ₺";

const SectionHead = ({ icon, title, count, color = "primary", loading }: any) => (
    <div className="d-flex align-items-center gap-2 mb-3">
        <div className="avatar-xs flex-shrink-0">
        <div className={`avatar-title bg-${color}-subtle text-${color} rounded fs-18`}>
            <i className={icon} />
        </div>
        </div>
        <div>
        <h5 className="mb-0 fw-semibold">{title}</h5>
        <small className="text-muted">
            {loading ? "aranıyor…" : `${count} sonuç`}
        </small>
        </div>
    </div>
);

const EmptyBlock = ({ text }: { text: string }) => (
    <div className="text-center text-muted py-4 border border-dashed rounded">
        <i className="ri-inbox-line fs-3 d-block mb-1 opacity-50" />
        <span className="fs-13">{text}</span>
    </div>
);

const LoadingBlock = () => (
    <div className="text-center py-4">
        <Spinner size="sm" color="primary" /> <span className="text-muted fs-13 ms-1">Yükleniyor…</span>
    </div>
);

const SearchResults = () => {
    const { config: tenantConfig } = useTenantContext();
    const { user: usr } = useAuth(); 
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");
    const { data: brand } = useGetBrand();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryFromUrl = searchParams.get("q") ?? "";
    const [searchValue, setSearchValue] = useState(queryFromUrl);
    document.title = "Arama Sonuçları | " + (brand?.companyName || "Workgrid");

    useEffect(() => { setSearchValue(queryFromUrl); }, [queryFromUrl]);

    const q = queryFromUrl.trim();
    const hasQuery = q.length > 0;

    const tablesQ = useTablesAll<ITableSummary>(
        hasQuery ? { filter: [`name:contains:${q}`], sort: "rowCount:desc" } : undefined
    );

    const blogQ = useGridbaseAll<IBlogRow>(
        BLOG_TABLE,
        hasQuery ? { search: q, searchFields: BLOG_SEARCH_FIELDS } : undefined
    );

    const productQ = useGridbaseAll<IProductRow>(
        ECOMMERCE_TABLE,
        hasQuery ? { search: q, searchFields: PRODUCT_SEARCH_FIELDS } : undefined
    );

    const tables = (hasQuery ? tablesQ.data : []) ?? [];
    const blogs = (hasQuery ? blogQ.data : []) ?? [];
    const products = (hasQuery ? productQ.data : []) ?? [];

    const submitSearch = () => {
        const v = searchValue.trim();
        setSearchParams(v ? { q: v } : {}, { replace: true });
    };

    const goToPage = (path: string) => {
        navigate(q ? `${path}?q=${encodeURIComponent(q)}` : path);
    };

    return (
        <div className="page-content">
        <Container fluid>
            <BreadCrumb title="Arama Sonuçları" pageTitle={brand?.companyName || "Workgrid"} />

            <Row className="justify-content-center mb-4">
            <Col lg={7}>
                <div className="position-relative">
                <Input
                    type="text"
                    autoComplete="off"
                    className="form-control form-control-lg bg-body-tertiary border-0 ps-4 pe-5 rounded-pill"
                    placeholder="Ürün, blog, tablo ara…"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
                />
                <button
                    onClick={submitSearch}
                    className="btn btn-primary rounded-circle position-absolute end-0 top-50 translate-middle-y me-1 d-flex align-items-center justify-content-center"
                    style={{ width: 40, height: 40 }}
                >
                    <i className="ri-search-line" />
                </button>
                </div>
                <p className="text-center text-muted mt-3 mb-0">
                <span className="fw-medium text-primary fst-italic">
                    "{queryFromUrl || "…"}"
                </span>{" "}
                için sonuçlar
                </p>
            </Col>
            </Row>

            {!hasQuery ? (
            <Card>
                <CardBody className="text-center text-muted py-5">
                <i className="ri-search-2-line fs-1 d-block mb-2 opacity-50" />
                Aramak için yukarıya bir kelime yazıp Enter'a basın.
                </CardBody>
            </Card>
            ) : (
            <Card>
                <CardBody className="p-4">


                {(isAdmin || (!tenantConfig.showBLog && !tenantConfig.showECommerce && tenantConfig.showCrm) )&&
                <>
                    <section className="mb-2">
                        <SectionHead
                        icon="ri-table-line" title="Tablolar"
                        count={tables.length} color="primary"
                        loading={tablesQ.isLoading}
                        />
                        {tablesQ.isLoading ? (
                        <LoadingBlock />
                        ) : tables.length === 0 ? (
                        <EmptyBlock text="Eşleşen tablo bulunamadı." />
                        ) : (
                        <>
                            <Row className="g-3">
                            {tables.slice(0, 4).map((t) => (
                                <Col lg={6} key={t.id}>
                                <Link to={`/datatable/`+t.id} className="text-decoration-none">
                                    <div className="d-flex align-items-center gap-3 p-3 border rounded-3 h-100 search-hover">
                                    <div className="avatar-sm flex-shrink-0">
                                        <div className="avatar-title bg-primary-subtle text-primary rounded fs-22">
                                        <i className="ri-table-line" />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h6 className="mb-1 text-body text-truncate">{t.name}</h6>
                                        <p className="text-muted fs-13 mb-1 text-truncate">
                                        {t.columnCount ?? 0} kolon
                                        </p>
                                        <Badge color="primary" className="bg-primary-subtle text-primary">
                                        {t.rowCount ?? 0} kayıt
                                        </Badge>
                                    </div>
                                    <i className="ri-arrow-right-line text-muted fs-18 flex-shrink-0" />
                                    </div>
                                </Link>
                                </Col>
                            ))}
                            </Row>
                        </>
                        )}
                        <div className="text-center mt-3">
                            <button className="btn btn-soft-primary btn-sm" onClick={() => goToPage("/datatables")}>
                                Daha Fazla Gör <i className="ri-arrow-right-line align-bottom" />
                            </button>
                        </div>
                    </section>
                </>
                }

                {(isAdmin || tenantConfig.showBLog) &&
                <>
                    <hr className="my-4 text-muted opacity-25" />

                    <section className="mb-2">
                        <SectionHead
                        icon="ri-article-line" title="Blog Yazıları"
                        count={blogs.length} color="info"
                        loading={blogQ.isLoading}
                        />
                        {blogQ.isLoading ? (
                        <LoadingBlock />
                        ) : blogs.length === 0 ? (
                        <EmptyBlock text="Eşleşen blog yazısı bulunamadı." />
                        ) : (
                        <>
                            <Row className="g-3">
                            {blogs.slice(0, 4).map((b) => (
                                <Col lg={6} key={b.id}>
                                <Link to={`/blog-overview/${b.id}`} className="text-decoration-none">
                                    <div className="d-flex gap-3 p-2 border rounded-3 h-100 search-hover">
                                    <img
                                        src={imgUrl(b.mainImage)}
                                        alt={b.title}
                                        className="rounded-3 flex-shrink-0"
                                        style={{ width: 96, height: 96, objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1 overflow-hidden py-1">
                                        {b.category && (
                                        <Badge color="info" className="bg-info-subtle text-info mb-1">{b.category}</Badge>
                                        )}
                                        <h6 className="mb-1 text-body text-truncate">{b.title}</h6>
                                        <p className="text-muted fs-13 mb-2" style={{
                                        display: "-webkit-box", WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical" as any, overflow: "hidden",
                                        }}>{b.excerpt ?? b.summary ?? b.description}</p>
                                        <div className="d-flex align-items-center gap-3 text-muted fs-12">
                                        {b.author && <span><i className="ri-user-3-line me-1" />{b.author}</span>}
                                        {b.publishedDate && <span><i className="ri-calendar-2-line me-1" />{b.publishedDate}</span>}
                                        </div>
                                    </div>
                                    </div>
                                </Link>
                                </Col>
                            ))}
                            </Row>
                        </>
                        )}
                        <div className="text-center mt-3">
                            <button className="btn btn-soft-info btn-sm" onClick={() => goToPage("/blog-list")}>
                                Daha Fazla Gör <i className="ri-arrow-right-line align-bottom" />
                            </button>
                        </div>
                    </section>
                </>
                }

                
                {(isAdmin || tenantConfig.showECommerce) &&
                <>
                    <hr className="my-4 text-muted opacity-25" />

                    <section>
                        <SectionHead
                        icon="ri-shopping-bag-line" title="Ürünler"
                        count={products.length} color="success"
                        loading={productQ.isLoading}
                        />
                        {productQ.isLoading ? (
                        <LoadingBlock />
                        ) : products.length === 0 ? (
                        <EmptyBlock text="Eşleşen ürün bulunamadı." />
                        ) : (
                        <>
                            <Row className="g-3">
                            {products.slice(0, 5).map((p) => {
                                const hasDiscount = p.discountedPrice != null && p.discountedPrice < (p.price ?? 0);
                                const discountPct = hasDiscount && p.price
                                ? Math.round((1 - (p.discountedPrice as number) / p.price) * 100)
                                : 0;
                                return (
                                <Col xl={3} lg={4} sm={6} key={p.id}>
                                    <Link to={`/product-detail/${p.id}`} className="text-decoration-none">
                                    <Card className="border-0 shadow-sm h-100 mb-0 overflow-hidden search-hover" style={{ borderRadius: 14 }}>
                                        <div className="position-relative bg-body-tertiary">
                                        <img
                                            src={imgUrl(p.mainImage)}
                                            alt={p.name}
                                            className="w-100 d-block"
                                            style={{ aspectRatio: "1/1", objectFit: "cover" }}
                                        />
                                        {discountPct > 0 && (
                                            <Badge color="danger" className="position-absolute top-0 start-0 m-2 rounded-pill">
                                            %{discountPct}
                                            </Badge>
                                        )}
                                        {p.stock === 0 && (
                                            <span className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white text-center fs-12 py-1">
                                            Stokta yok
                                            </span>
                                        )}
                                        </div>
                                        <CardBody className="p-2">
                                        {p.brand && <p className="text-muted fs-12 mb-1">{p.brand}</p>}
                                        <h6 className="fs-14 text-body text-truncate mb-2">{p.name}</h6>
                                        <div className="d-flex align-items-baseline gap-2">
                                            <span className="fw-semibold fs-15">
                                            {formatPrice(hasDiscount ? p.discountedPrice : p.price)}
                                            </span>
                                            {hasDiscount && <del className="text-muted fs-12">{formatPrice(p.price)}</del>}
                                        </div>
                                        </CardBody>
                                    </Card>
                                    </Link>
                                </Col>
                                );
                            })}
                            </Row>
                        </>
                        )}
                        <div className="text-center mt-3">
                            <button className="btn btn-soft-success btn-sm" onClick={() => goToPage("/products")}>
                                Daha Fazla Gör <i className="ri-arrow-right-line align-bottom" />
                            </button>
                        </div>
                    </section>
                </>
                }


                </CardBody>
            </Card>
            )}
        </Container>

        <style>{`
            .search-hover { transition: transform .2s ease, box-shadow .2s ease; }
            .search-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,.10);
            border-color: var(--vz-primary) !important;
            }
        `}</style>
        </div>
    );
};

export default SearchResults;