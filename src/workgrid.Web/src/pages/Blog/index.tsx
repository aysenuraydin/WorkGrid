// BlogListView.tsx
import React, { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Container, Row } from 'reactstrap'
import BreadCrumb from 'components/Common/BreadCrumb'
import { ViewMode } from './Components/BlogHelpers'
import Sidepanel from './Components/Sidepanel'
import BlogGridView from './Components/GridView'
import MainList from './Components/MainList'
import { useGridbaseAll } from 'hooks/useGridBase'
import { useGetBrand } from 'hooks/useBrand'
import { useAuth } from 'context/AuthContext'
import { useUserProfile } from 'hooks/useUser'
import { ToastContainer } from 'react-toastify'
import { BLOG_TABLE, CATEGORY_BLOG_TABLE } from 'common/data/constans'

const PER_PAGE_LIST = 6;
const PER_PAGE_GRID = 8;

const ViewToggle: React.FC<{ viewMode: ViewMode; onChange: (v: ViewMode) => void }> = ({ viewMode, onChange }) => (
    <div style={{
        display: 'inline-flex', background: '#f1f5f9',
        border: '1px solid #e2e8f0', borderRadius: 8, padding: 3, gap: 2,
    }}>
        {([
            { mode: 'list' as ViewMode, icon: 'ri-list-unordered',  label: 'Liste' },
            { mode: 'grid' as ViewMode, icon: 'ri-layout-grid-line', label: 'Grid'  },
        ] as const).map(({ mode, icon, label }) => (
            <button key={mode} onClick={() => onChange(mode)} title={label} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', fontSize: 13, fontWeight: 600,
                border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
                background:  viewMode === mode ? '#fff'    : 'transparent',
                color:       viewMode === mode ? '#4f46e5' : '#94a3b8',
                boxShadow:   viewMode === mode ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
            }}>
                <i className={icon} style={{ fontSize: 16 }} />
                <span className="d-none d-sm-inline">{label}</span>
            </button>
        ))}
    </div>
);

const matchesDateFilter = (dateStr: string | undefined, filter: string): boolean => {
    if (filter === "All") return true;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;

    const now = new Date();
    const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
    const today = startOfDay(now);
    const blogDay = startOfDay(d);
    const dayMs = 86400000;

    switch (filter) {
        case "Today":
            return blogDay.getTime() === today.getTime();
        case "Yesterday":
            return blogDay.getTime() === today.getTime() - dayMs;
        case "Last 7 Days":
            return d.getTime() >= today.getTime() - 7 * dayMs;
        case "Last 30 Days":
            return d.getTime() >= today.getTime() - 30 * dayMs;
        case "This Month":
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        case "Last Year":
            return d.getFullYear() === now.getFullYear() - 1;
        default:
            return true;
    }
};

const BlogListView = () => {
    const { data: brand } = useGetBrand();
    document.title = "Blog | " + (brand?.companyName || "Workgrid");

    // ── Route'tan gelen arama parametresi (q) ──
    const [searchParams] = useSearchParams();
    const queryFromUrl = searchParams.get("q") ?? "";
    const categoryFromUrl = searchParams.get("category") ?? "";   // ← YENİ

    const { data: blogCategories = [] } = useGridbaseAll<any>(CATEGORY_BLOG_TABLE);  // ← YENİ

    const [viewMode,    setViewMode]    = useState<ViewMode>('list');
    const [search,      setSearch]      = useState(queryFromUrl);
    const [dateFilter,  setDateFilter]  = useState('All');
    const [categoryId,  setCategoryId]  = useState<number | null>(null);
    const [activeTag,   setActiveTag]   = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setSearch(queryFromUrl);
        setCurrentPage(1);
    }, [queryFromUrl]);

    useEffect(() => {
    if (!categoryFromUrl) {
        setCategoryId(null);
        return;
    }
    const match = (blogCategories ?? []).find(
        (c: any) => (c.name ?? "").toLowerCase() === categoryFromUrl.toLowerCase()
    );
    if (match) {
        setCategoryId(Number(match.id));
        setCurrentPage(1);
    }
}, [categoryFromUrl, blogCategories]);

    const perPage = viewMode === 'list' ? PER_PAGE_LIST : PER_PAGE_GRID;

    const handleViewChange = (v: ViewMode)       => { setViewMode(v);   setCurrentPage(1); };
    const handleSearch     = (v: string)         => { setSearch(v);     setCurrentPage(1); };
    const handleDate       = (v: string)         => { setDateFilter(v); setCurrentPage(1); };
    const handleCategory   = (id: number | null) => { setCategoryId(id); setCurrentPage(1); };
    const handleTag        = (t: string | null)  => { setActiveTag(t);  setCurrentPage(1); };

    const { data: allBlogs = [], isLoading } = useGridbaseAll<any>(BLOG_TABLE);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const tag = (activeTag ?? "").toLowerCase();

        return (allBlogs ?? [])
            .filter((b) => {
                // başlık araması
                if (q && !((b.title ?? "").toLowerCase().includes(q))) return false;
                // kategori
                if (categoryId != null && Number(b.wGBlogCategoryId) !== Number(categoryId)) return false;
                // etiket (tags içinde geçiyor mu)
                if (tag && !((b.tags ?? "").toLowerCase().includes(tag))) return false;
                // tarih
                if (!matchesDateFilter(b.publishedDate || b.createdAt, dateFilter)) return false;
                return true;
            })
            // en yeni önce (id'ye göre)
            .sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0));
    }, [allBlogs, search, categoryId, activeTag, dateFilter]);

    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    const rows = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filtered.slice(start, start + perPage);
    }, [filtered, currentPage, perPage]);

    const { user: usr } = useAuth();
    const { data: user } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Blog" pageTitle={brand?.companyName || "Workgrid"} />

                    {queryFromUrl && (
                        <div className="mb-3">
                            <span className="text-muted">
                                <span className="fw-medium text-primary">"{queryFromUrl}"</span> için sonuçlar
                            </span>
                        </div>
                    )}

                    <div className="row g-3 mb-3 align-items-center">
                        <div className="col-sm">
                            <div className="d-flex justify-content-sm-end align-items-center gap-2 flex-wrap">
                                {activeTag && (
                                    <span className="badge bg-primary-subtle text-primary d-inline-flex align-items-center gap-1">
                                        #{activeTag}
                                        <i className="ri-close-line" style={{ cursor: "pointer" }} onClick={() => handleTag(null)} />
                                    </span>
                                )}
                                <div className="search-box">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ara..."
                                        value={search}
                                        onChange={e => handleSearch(e.target.value)}
                                    />
                                    <i className="ri-search-line search-icon" />
                                </div>
                                <select
                                    className="form-control"
                                    style={{ width: 152 }}
                                    value={dateFilter}
                                    onChange={e => handleDate(e.target.value)}
                                >
                                    <option value="All">Tümü</option>
                                    <option value="Today">Bugün</option>
                                    <option value="Yesterday">Dün</option>
                                    <option value="Last 7 Days">Son 7 Gün</option>
                                    <option value="Last 30 Days">Son 30 Gün</option>
                                    <option value="This Month">Bu Ay</option>
                                    <option value="Last Year">Geçen Yıl</option>
                                </select>
                                {isAdmin && (
                                    <div>
                                        <Link to="/blog-create" className="btn btn-soft-success">
                                            <i className="ri-add-line align-bottom" />
                                        </Link>
                                    </div>
                                )}
                                <ViewToggle viewMode={viewMode} onChange={handleViewChange} />
                            </div>
                        </div>
                    </div>

                    <Row>
                        <Sidepanel
                            activeCategoryId={categoryId}
                            onCategoryChange={handleCategory}
                            activeTag={activeTag}
                            onTagChange={handleTag}
                        />
                        <div className="col-xxl-9">
                            {isLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" />
                                    <p className="text-muted mt-2 mb-0 small">Yükleniyor…</p>
                                </div>
                            ) : viewMode === 'list' ? (
                                <MainList
                                    rows={rows}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalCount={totalCount}
                                    totalPages={totalPages}
                                    perPageData={perPage}
                                />
                            ) : (
                                <BlogGridView
                                    rows={rows}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalCount={totalCount}
                                    totalPages={totalPages}
                                    perPageData={perPage}
                                />
                            )}
                        </div>
                    </Row>
                </Container>
            </div>
            <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
        </React.Fragment>
    );
};

export default BlogListView;