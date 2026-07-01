import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";
import { useGridbaseAll } from "hooks/useGridBase";
import config from "config";

interface WGBlogCategory { id: number; name: string; }
interface WGBlog {
    id: number;
    image?: string;
    title: string;
    views?: number;
    tags?: string;
    publishedDate?: string;
    createdAt?: string;
    wGBlogCategoryId: number;
}

const BLOG_TABLE = "WG Blog";
const CATEGORY_TABLE = "WG Blog Category";

const resolveImg = (name?: string | null) =>
    !name
        ? "https://dummyimage.com/100x100/F3F6F9/969696.jpg"
        : name.startsWith("http") ? name : `${config.api.FILE_API_URL}/File/${name}`;

interface SidepanelProps {
    activeCategoryId: number | null;
    onCategoryChange: (categoryId: number | null) => void;
    searchTerm?: string;
    onSearch?: (term: string) => void;
    activeTag?: string | null;
    onTagChange?: (tag: string | null) => void;
}

const Sidepanel: React.FC<SidepanelProps> = ({
    activeCategoryId,
    onCategoryChange,
    searchTerm = "",
    onSearch,
    activeTag = null,
    onTagChange,
}) => {
    const { data: categoriesRaw = [], isLoading: catLoading } =
        useGridbaseAll<WGBlogCategory>(CATEGORY_TABLE);
    const { data: blogs = [] } = useGridbaseAll<WGBlog>(BLOG_TABLE);

    const [localSearch, setLocalSearch] = useState(searchTerm);

    const categories = useMemo(
        () => (categoriesRaw ?? []).filter((c) => c.name),
        [categoriesRaw]
    );

    const countByCategory = useMemo(() => {
        const map: Record<number, number> = {};
        (blogs ?? []).forEach((b) => {
        map[b.wGBlogCategoryId] = (map[b.wGBlogCategoryId] ?? 0) + 1;
        });
        return map;
    }, [blogs]);

    const popularPosts = useMemo(
        () =>
        [...(blogs ?? [])]
            .sort((a, b) => Number(b.views ?? 0) - Number(a.views ?? 0))
            .slice(0, 4),
        [blogs]
    );

    const tags = useMemo(() => {
        const set = new Set<string>();
        (blogs ?? []).forEach((b) => {
        (b.tags ?? "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .forEach((t) => set.add(t));
        });
        return Array.from(set);
    }, [blogs]);

    const handleCategoryClick = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        onCategoryChange(activeCategoryId === id ? null : id);
    };

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(localSearch.trim());
    };

    const formatDate = (b: WGBlog) => {
        const d = b.publishedDate || b.createdAt;
        if (!d) return "";
        const date = new Date(d);
        return isNaN(date.getTime())
        ? ""
        : date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
    };
    const archives = useMemo(() => {
            const map: Record<string, number> = {};
        (blogs ?? []).forEach((b) => {
            const date = b.createdAt;
            if (date) {
                const year = new Date(date).getFullYear().toString();
                map[year] = (map[year] ?? 0) + 1;
            }
        });
        return Object.entries(map).sort((a, b) => Number(b[0]) - Number(a[0]));
    }, [blogs]);

    return (
        <React.Fragment>
            <Col xxl={3}>
                <Card>
                <CardBody className="p-4">
                    {/* ── Arama ── */}
                    <form className="search-box" onSubmit={submitSearch}>
                    <p className="text-muted">Ara</p>
                    <div className="position-relative">
                        <input
                        type="text"
                        className="form-control rounded bg-light border-light"
                        placeholder="Yazılarda ara..."
                        value={localSearch}
                        onChange={(e) => {
                            setLocalSearch(e.target.value);
                            onSearch?.(e.target.value);
                        }}
                        />
                        <i className="mdi mdi-magnify search-icon"></i>
                    </div>
                    </form>

                    {/* ── Kategoriler ── */}
                    <div className="mt-4 pt-4 border-top border-dashed border-bottom-0 border-start-0 border-end-0">
                    <p className="text-muted">Kategoriler</p>

                    {catLoading ? (
                        <p className="text-muted mb-0 small">Yükleniyor…</p>
                    ) : categories.length === 0 ? (
                        <p className="text-muted mb-0 small">Henüz kategori yok.</p>
                    ) : (
                        <ul className="list-unstyled fw-medium">
                        <li>
                            <Link
                            to="#"
                            onClick={(e) => { e.preventDefault(); onCategoryChange(null); }}
                            className={"py-2 d-block " + (activeCategoryId === null ? "text-primary fw-semibold" : "text-muted")}
                            >
                            <i className="mdi mdi-chevron-right me-1"></i> Tümü
                            </Link>
                        </li>
                        {categories.map((cat) => {
                            const count = countByCategory[cat.id] ?? 0;
                            const active = activeCategoryId === cat.id;
                            return (
                            <li key={cat.id}>
                                <Link
                                to="#"
                                onClick={(e) => handleCategoryClick(e, cat.id)}
                                className={"py-2 d-block " + (active ? "text-primary fw-semibold" : "text-muted")}
                                >
                                <i className="mdi mdi-chevron-right me-1"></i> {cat.name}
                                {count > 0 && (
                                    <span className="badge badge-soft-success rounded-pill float-end ms-1 font-size-12">
                                    {String(count).padStart(2, "0")}
                                    </span>
                                )}
                                </Link>
                            </li>
                            );
                        })}
                        </ul>
                    )}
                    </div>

                    {/* ── Popüler Yazılar ── */}
                    {popularPosts.length > 0 && (
                    <div className="mt-4 pt-4 border-top border-dashed border-bottom-0 border-start-0 border-end-0">
                        <p className="text-muted mb-2">Popüler Yazılar</p>

                        <div className="list-group list-group-flush">
                        {popularPosts.map((post) => (
                            <Link
                            to={`/blog-detail/${post.id}`}
                            className="list-group-item text-muted py-3 px-2"
                            key={post.id}
                            >
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 me-3">
                                <img
                                    src={resolveImg(post.image)}
                                    alt=""
                                    className="avatar-md h-auto d-block rounded"
                                    style={{ width: 56, height: 56, objectFit: "cover" }}
                                    onError={(e) => {
                                    e.currentTarget.src = "https://dummyimage.com/100x100/F3F6F9/969696.jpg";
                                    e.currentTarget.onerror = null;
                                    }}
                                />
                                </div>
                                <div className="flex-grow-1 overflow-hidden">
                                <h5 className="fs-15 text-truncate">{post.title}</h5>
                                <p className="mb-0 text-truncate">
                                    {formatDate(post)}
                                    {post.views != null && (
                                    <span className="ms-2"><i className="ri-eye-line align-bottom"></i> {post.views}</span>
                                    )}
                                </p>
                                </div>
                            </div>
                            </Link>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* ── Arşiv ── */}
                    {archives.length > 0 && (
                        <div className="mt-4 pt-4 border-top border-dashed border-bottom-0 border-start-0 border-end-0">
                            <p className="text-muted">Arşiv</p>

                            <ul className="list-unstyled fw-medium">
                                {archives.map(([year, count]) => (
                                    <li key={year}>
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                console.log("Seçilen Yıl:", year);
                                            }}
                                            className="text-muted py-2 d-block"
                                        >
                                            <i className="mdi mdi-chevron-right me-1"></i> {year}
                                            <span className="badge badge-soft-success rounded-pill float-end ms-1 font-size-12">
                                                {String(count).padStart(2, "0")}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── Etiketler ── */}
                    {tags.length > 0 && (
                    <div className="mt-4 pt-4 border-top border-dashed border-bottom-0 border-start-0 border-end-0">
                        <p className="text-muted">Etiketler</p>

                        <div className="d-flex flex-wrap gap-2 widget-tag">
                        {tags.map((tag, i) => {
                            const active = activeTag === tag;
                            return (
                            <div key={i}>
                                <Link
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onTagChange?.(active ? null : tag);
                                }}
                                className={
                                    "badge font-size-12 " +
                                    (active ? "bg-primary text-white" : "bg-light text-muted")
                                }
                                >
                                {tag}
                                </Link>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    )}
                </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default Sidepanel;