import { useState, useMemo, useEffect } from "react";
import "nouislider/distribute/nouislider.css";
import {
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  NavItem,
  NavLink,
  Row,
  Card,
  CardHeader,
  Col,
  UncontrolledCollapse,
} from "reactstrap";
import classnames from "classnames";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import Nouislider from "nouislider-react";
import { Image } from 'antd';
import BreadCrumb from "components/Common/BreadCrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import config from "config";

import { useGridbaseAll, useDeleteRow } from "hooks/useGridBase";
import { IProduct, IProductCategory, IProductVariant } from "common/data/ecommerce";
import { useCommentsRaitingAverages } from "hooks/useComment";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";
import { CommentItemType } from "common/data/comment";
import { CATEGORY_ECOMMERCE_TABLE, ECOMMERCE_TABLE, PRODUCT_VARIANT_TABLE } from "common/data/constans";
import { useGetCommerce } from "hooks/useCommerce";
import useThemeMode from "hooks/useThemeMode";



const EcommerceProducts = () => {
  const navigate = useNavigate();
  const { data: brand } = useGetBrand();
  const { data } = useGetCommerce();
  document.title = "Ürünler | " + (brand?.companyName || "Workgrid");

  // ── Route'tan gelen arama parametresi (q) ──
  const [searchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const categoryFromUrl = searchParams.get("category") ?? "";

  // ── GridBase verileri ──
  const { data: products, isLoading } = useGridbaseAll<IProduct>(ECOMMERCE_TABLE);
  const { data: categoryList } = useGridbaseAll<IProductCategory>(CATEGORY_ECOMMERCE_TABLE);
  const { data: variants} = useGridbaseAll<IProductVariant>(PRODUCT_VARIANT_TABLE);
  const del = useDeleteRow(ECOMMERCE_TABLE);

  const { user: usr } = useAuth(); 
  const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
  const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

  const [activeTab, setActiveTab] = useState("1");
  const [deleteModal, setDeleteModal] = useState(false);
  const [target, setTarget] = useState<any>(null);

  // ── Filtre state'leri ──
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); 
  const [ratingFilters, setRatingFilters] = useState<number[]>([]);              
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);   
  const [brandFilters, setBrandFilters] = useState<string[]>([]);

  const uniqueBrands = useMemo(() => {
    const set = new Set<string>();
    (products ?? []).forEach((p) => { if (p.brand?.trim()) set.add(p.brand.trim()); });
    return Array.from(set).sort();
  }, [products]);

  const brandCounts = useMemo(() => {
    const map: Record<string, number> = {};
    (products ?? []).forEach((p) => {
      if (p.brand?.trim()) map[p.brand.trim()] = (map[p.brand.trim()] || 0) + 1;
    });
    return map;
  }, [products]);

  // Kategori id → ad haritası
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    (categoryList ?? []).forEach((c: any) => { map[c.id] = c.name; });
    return map;
  }, [categoryList]);
  
  const variantSummary = useMemo(() => {
    const map: Record<number, { startingPrice: number | null; totalStock: number; discountPercent: number }> = {};
    (variants ?? []).forEach((v: any) => {
      const pid = v.wGProductId;
      if (!map[pid]) map[pid] = { startingPrice: null, totalStock: 0, discountPercent: 0 };
      const price = Number(v.price);
      if (!isNaN(price)) {
        if (map[pid].startingPrice == null || price < map[pid].startingPrice!) {
          map[pid].startingPrice = price;
          map[pid].discountPercent = Number(v.discountPercent) || 0;
        }
      }
      map[pid].totalStock += Number(v.stock) || 0;
    });
    return map;
  }, [variants]);

  useEffect(() => {
    if (!categoryFromUrl) {
        setSelectedCategory(null);
        return;
    }
    const match = (categoryList ?? []).find(
        (c: any) => (c.name ?? "").toLowerCase() == categoryFromUrl.toLowerCase()
    );
    if (match) setSelectedCategory(Number(match.id));
  }, [categoryFromUrl, categoryList]);

  const productIds = useMemo(
    () => (products ?? []).map((p) => String(p.id)),
    [products]
  );
  const { data: ratingMap } = useCommentsRaitingAverages("Product", productIds);

  // Fiyat slider'ı için max fiyat (varyantlardan)
  const maxPrice = useMemo(() => {
    let max = 0;
    (variants ?? []).forEach((v: any) => {
      const p = Number(v.price);
      if (!isNaN(p) && p > max) max = p;
    });
    return max || 100000;
  }, [variants]);

  // ── Filtre fonksiyonları ──
  const toggleRating = (n: number, checked: boolean) => {
    setRatingFilters(prev => checked ? [...prev, n] : prev.filter(r => r !== n));
  };

  const clearAll = () => {
    setSelectedCategory(null);
    setRatingFilters([]);
    setPriceRange([0, maxPrice]);
    setBrandFilters([]);
  };

  // ── Tab dışındaki tüm filtreler (arama, kategori, rating, fiyat, marka) ──
  const baseFiltered = useMemo(() => {
    let all = (products ?? []) as IProduct[];

    // Route'tan gelen arama (q) — isim / marka / etiket
    const q = queryFromUrl.trim().toLowerCase();
    if (q) {
      all = all.filter(p =>
        (p.name ?? "").toLowerCase().includes(q) ||
        (p.brand ?? "").toLowerCase().includes(q) ||
        (p.tags ?? "").toLowerCase().includes(q)
      );
    }

    // Kategori filtresi
    if (selectedCategory != null)
      all = all.filter(p => Number(p.wGProductCategoryId) == Number(selectedCategory));
    // Rating filtresi (seçili min'lerden herhangi birini geçen)
    if (ratingFilters.length > 0) {
      const minWanted = Math.min(...ratingFilters);
      all = all.filter(p => (ratingMap?.[String(p.id)] ?? 0) >= minWanted);
    }

    // Marka filtresi
    if (brandFilters.length > 0)
      all = all.filter(p => p.brand && brandFilters.includes(p.brand.trim()));

    // Fiyat filtresi (başlayan fiyat aralıkta mı)
    all = all.filter(p => {
      const s = variantSummary[p.id];
      if (!s || s.startingPrice == null) return true; // fiyatsızsa eleme
      return s.startingPrice >= priceRange[0] && s.startingPrice <= priceRange[1];
    });

    return all;
  }, [products, queryFromUrl, selectedCategory, ratingFilters, priceRange, variantSummary, ratingMap, brandFilters]);

  // ── Liste: baseFiltered + aktif tab (status) ──
  const list = useMemo(() => {
    let all = baseFiltered;
    if (activeTab == "2") all = all.filter(p => p.status == "published");
    if (activeTab == "3") all = all.filter(p => p.status == "draft");
    return all;
  }, [baseFiltered, activeTab]);

  // ── Tab sayaçları: filtrelenmiş listeye göre ──
  const counts = useMemo(() => {
    return {
      all: baseFiltered.length,
      published: baseFiltered.filter(p => p.status == "published").length,
      draft: baseFiltered.filter(p => p.status == "draft").length,
    };
  }, [baseFiltered]);

  // Kategori başına ürün sayısı (badge için)
  const categoryCounts = useMemo(() => {
    const map: Record<number, number> = {};
    (products ?? []).forEach((p: any) => {
      const cid = p.wGProductCategoryId;
      if (cid != null) map[cid] = (map[cid] || 0) + 1;
    });
    return map;
  }, [products]);

  const askDelete = (p: any) => { setTarget(p); setDeleteModal(true); };
  const doDelete = () => {
    if (!target) return;
    del.mutate(target.id, {
      onSuccess: () => toast.success("Ürün silindi."),
      onError: () => toast.error("Silinemedi."),
    });
    setDeleteModal(false);
  };

  const { isDark } = useThemeMode();
  const dummy = "https://dummyimage.com/300x300/"+(isDark?"031426":"F3F6F9")+"/"+(isDark?"fff":"969696")+"&text="+ brand?.companyName

    // https://dummyimage.com/600x400/000/fff&text=dedededed
  const resolveImg = (name?: string) =>
    !name 
    ? dummy
    : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

    const columns = useMemo(() => {
      // ── Temel kolonlar (herkese gorunur) ──
      const baseColumns = [
        {
          header: "Ürün",
          accessorKey: "name",
          enableColumnFilter: false,
          cell: (c: any) => {
            const row = c.row.original;
            const img = resolveImg(row.mainImage);
            return (
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 me-3">
                  <div className={`avatar-sm bg-${isDark ? "dark" : "light"} rounded p-1`} style={{ width: "124px", height: "124px" }}>
                    <Image
                      height={120}
                      src={img!}
                      className="img-contain d-block rounded"
                      alt="ürün görseli"
                      onError={(e) => {
                        e.currentTarget.src = dummy;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="fs-14 mb-1">
                    <Link to={`/product-detail/${row.id}`} className="text-body">{c.getValue()}</Link>
                  </h5>
                  <p className="text-muted mb-0">
                    Kategori: <span className="fw-medium">
                      {categoryMap[row.wGProductCategoryId] ?? "—"}
                    </span>
                  </p>
                </div>
              </div>
            );
          },
        },
        {
          header: "Marka", accessorKey: "brand", enableColumnFilter: false,
          cell: (c: any) => c.getValue()
            ? <span>{c.getValue()}</span>
            : <span className="text-muted">—</span>
        },
        {
          header: "Stok", id: "stock", enableColumnFilter: false,
          cell: (c: any) => {
            const s = variantSummary[c.row.original.id];
            return s ? s.totalStock : "—";
          }
        },
        {
          header: "Fiyat", id: "price", enableColumnFilter: false,
          cell: (c: any) => {
            const s = variantSummary[c.row.original.id];
            if (!s || s.startingPrice == null) return "—";

            if (s.discountPercent > 0) {
              const discounted = Math.round(s.startingPrice * (1 - s.discountPercent / 100) * 100) / 100;
              return (
                <div className="d-flex flex-column">
                  <span className="fw-medium text-danger">{data?.currencyCode} {discounted}</span>
                  <span className="text-muted text-decoration-line-through fs-12">{data?.currencyCode} {s.startingPrice}</span>
                  <span className="badge bg-danger-subtle text-danger fs-11 mt-1" style={{ width: "fit-content" }}>
                    %{s.discountPercent} İndirim
                  </span>
                </div>
              );
            }

            return `${data?.currencyCode} ${s.startingPrice}`;
          }
        },
        {
          header: "Sipariş", accessorKey: "totalOrders", enableColumnFilter: false,
          cell: (c: any) => c.getValue() ?? 0
        },
        {
          header: "Puan", id: "rating", enableColumnFilter: false,
          cell: (c: any) => {
            const r = ratingMap?.[String(c.row.original.id)] ?? 0;
            return (
              <span className={`badge bg-${isDark ? "soft-" : ""}light text-body fs-12 fw-medium`}>
                <i className="mdi mdi-star text-warning me-1" />{r}
              </span>
            );
          }
        },
        {
          header: "Yayın Tarihi", accessorKey: "publishedDate", enableColumnFilter: false,
          cell: (c: any) => c.getValue()
            ? <span>{moment(c.getValue()).format("DD MMM Y")}</span>
            : <span className="text-muted">—</span>
        },
      ];

      // ── Admin'e ozel "Islemler" kolonu ──
      if (isAdmin) {
        baseColumns.push({
          header: "İşlemler",
          enableColumnFilter: false,
          cell: (c: any) => {
            const row = c.row.original;
            return (
              <UncontrolledDropdown>
                <DropdownToggle href="#" className="btn btn-soft-primary btn-sm" tag="button">
                  <i className="ri-more-fill" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem onClick={() => navigate(`/product-detail/${row.id}`)}>
                    <i className="ri-eye-fill align-bottom me-2 text-muted" /> İncele
                  </DropdownItem>
                  <DropdownItem onClick={() => navigate(`/edit-product/${row.id}`)}>
                    <i className="ri-pencil-fill align-bottom me-2 text-muted" /> Düzenle
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => askDelete(row)} className="text-danger">
                    <i className="ri-delete-bin-fill align-bottom me-2 text-danger" /> Sil
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            );
          },
        } as any);
      }

      return baseColumns;
    }, [categoryMap, variantSummary, navigate, ratingMap, data, isAdmin, isDark, dummy]);

  return (
    <div className="page-content">
      <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={doDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Container fluid>
        <BreadCrumb title="Ürünler" pageTitle={brand?.companyName || "Workgrid"} />

        {queryFromUrl && (
          <div className="mb-3">
            <span className="text-muted">
              <span className="fw-medium text-primary">"{queryFromUrl}"</span> için sonuçlar
            </span>
          </div>
        )}

        <Row>
          <Col xl={3} lg={4}>
            <Card className="border border-2">
              <CardHeader>
                <div className="d-flex mb-3">
                  <div className="flex-grow-1">
                    <h5 className="fs-16">Filtreler</h5>
                  </div>
                  <div className="flex-shrink-0">
                    <Link to="#" className="text-decoration-underline text-primary" onClick={(e) => { e.preventDefault(); clearAll(); }}>
                      Temizle
                    </Link>
                  </div>
                </div>
              </CardHeader>

              <div className="accordion accordion-flush">
                {/* ── Kategoriler ── */}
                <div className="card-body border-bottom">
                  <div>
                    <p className="text-muted text-uppercase fs-12 fw-medium mb-2">
                      Kategoriler
                    </p>
                    <ul className="list-unstyled mb-0 filter-list">
                      {(categoryList ?? []).map((cat: any) => (
                        <li key={cat.id}>
                          <Link
                            to="#"
                            className={selectedCategory == cat.id
                              ? "active d-flex py-1 align-items-center"
                              : "d-flex py-1 align-items-center"}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedCategory(selectedCategory == cat.id ? null : cat.id);
                            }}
                          >
                            <div className="flex-grow-1">
                              <h5 className="fs-13 mb-0 listname">{cat.name}</h5>
                            </div>
                            {categoryCounts[cat.id] ? ( 
                              <div className="flex-shrink-0 ms-2">
                                <span className={`badge bg-${isDark ?"soft-":""}light text-muted ms-2`}>
                                  <span className={`${isDark ?"text-light":""}`} >{categoryCounts[cat.id]}</span>
                                </span>
                              </div>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Fiyat Aralığı ── */}
                <div className="card-body border-bottom">
                  <p className="text-muted text-uppercase fs-12 fw-medium mb-4">
                    Fiyat Aralığı
                  </p>
                  <Nouislider
                    range={{ min: 0, max: maxPrice }}
                    start={[0, maxPrice]}
                    connect
                    onSlide={(render: any, handle: any, value: any) => {
                      setPriceRange([Math.round(value[0]), Math.round(value[1])]);
                    }}
                  />
                  <div className="formCost d-flex gap-2 align-items-center mt-3">
                    <input className="form-control form-control-sm" type="text" value={data?.currencyCode +" "+priceRange[0]} id="minCost" readOnly />
                    <span className="fw-semibold text-muted">ile</span>
                    <input className="form-control form-control-sm" type="text" value={data?.currencyCode +" "+ priceRange[1]} id="maxCost" readOnly />
                  </div>
                </div>

                {/* ── Markalar ── */}
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button bg-transparent shadow-none" type="button" id="flush-headingBrands">
                      <span className="text-muted text-uppercase fs-12 fw-medium">Markalar</span>{" "}
                      {brandFilters.length > 0 && (
                        <span className="badge bg-success rounded-pill align-middle ms-1">{brandFilters.length}</span>
                      )}
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingBrands" defaultOpen>
                    <div className="accordion-body text-body pt-0">
                      {uniqueBrands.length == 0 ? (
                        <p className="text-muted fs-13 mb-0">Henüz marka eklenmemiş.</p>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          {uniqueBrands.map((b) => (
                            <div className="form-check" key={b}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`brandFilter-${b}`}
                                checked={brandFilters.includes(b)}
                                onChange={(e) =>
                                  setBrandFilters((prev) =>
                                    e.target.checked ? [...prev, b] : prev.filter((x) => x !== b)
                                  )
                                }
                              />
                              <label className="form-check-label d-flex justify-content-between" htmlFor={`brandFilter-${b}`}>
                                <span>{b}</span>
                                <span className={`badge bg-${isDark ?"soft-":""}light text-muted ms-2`}>
                                  <span className={`${isDark ?"text-light":""}`} >{brandCounts[b] ?? 0}</span>
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </UncontrolledCollapse>
                </div>

                {/* ── Değerlendirme ── */}
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button bg-transparent shadow-none collapsed" type="button" id="flush-headingRating">
                      <span className="text-muted text-uppercase fs-12 fw-medium">Puan</span>{" "}
                      <span className="badge bg-primary rounded-pill align-middle ms-1">{ratingFilters.length}</span>
                    </button>
                  </h2>
                  <UncontrolledCollapse toggler="#flush-headingRating">
                    <div className="accordion-collapse collapse show">
                      <div className="accordion-body text-body">
                        <div className="d-flex flex-column gap-2">
                          {[4, 3, 2, 1].map((n) => (
                            <div className="form-check" key={n}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`productratingRadio${n}`}
                                checked={ratingFilters.includes(n)}
                                onChange={(e) => toggleRating(n, e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor={`productratingRadio${n}`}>
                                <span className="text-muted">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`mdi mdi-star ${i < n ? "text-warning" : ""}`}></i>
                                  ))}
                                </span>{" "}
                                {n == 1 ? "1 ve üzeri" : `${n} ve üzeri`}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </UncontrolledCollapse>
                </div>
              </div>
            </Card>
          </Col>

          {/* Ürün Listesi */}
          <Col xl={9} lg={8}>
            <Card className="border border-2">
              <div className="card-header border-0">
                <Row className="align-items-center">
                  <Col>
                    <Nav className="nav-tabs-custom card-header-tabs border-bottom-0" role="tablist">
                      <NavItem>
                        <NavLink className={classnames("text-primary",{ active: activeTab == "1" }, "fw-semibold")}
                          onClick={() => setActiveTab("1")} href="#">
                          Tümü <span className="badge bg-danger-subtle text-danger ms-1">{counts.all}</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames("text-primary",{ active: activeTab == "2" }, "fw-semibold")}
                          onClick={() => setActiveTab("2")} href="#">
                          Yayında <span className="badge bg-danger-subtle text-danger ms-1">{counts.published}</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className={classnames("text-primary",{ active: activeTab == "3" }, "fw-semibold")}
                          onClick={() => setActiveTab("3")} href="#">
                          Taslak <span className="badge bg-danger-subtle text-danger ms-1">{counts.draft}</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col className="text-end">
                  {isAdmin &&
                    <Link to={`/add-product`} className={`btn btn-${isDark ?"soft-":""}light btn-icon`}>
                      <i className={`ri-add-line ${isDark ?"text-light":""}`}  />
                    </Link> 
                  }
                  </Col>
                </Row>
              </div>
              <div className="card-body pt-0">
                {isLoading ? (
                  <div className="py-4"><Loader isText /></div>
                ) : list.length > 0 ? (
                  <TableContainer
                    columns={columns}
                    data={list}
                    isGlobalFilter
                    customPageSize={10}
                    divClass="table-responsive mb-1"
                    tableClass="mb-0 align-middle table-borderless"
                    theadClass={`table-${isDark ? 'dark':'light'} text-muted`}
                    thClass={`${isDark ? 'text-light':'text-dark'}`}
                    SearchPlaceholder="Ürün arayın..."
                  />
                ) : (
                  <div className="py-4 text-center">
                    <i className="ri-search-line display-5 text-success" />
                    <div className="mt-4"><h5>Ürün bulunamadı</h5></div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceProducts;