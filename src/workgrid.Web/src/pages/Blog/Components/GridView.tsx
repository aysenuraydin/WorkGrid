// ListView/GridView.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import Pagination from 'components/Common/Pagination'
import { resolveImg, parseTags } from './BlogHelpers'
import { useGetBrand } from 'hooks/useBrand'
import { useGetTenantConfig } from 'hooks/useTenant'
import { Image } from 'antd';

interface BlogGridViewProps {
    rows: any[];
    currentPage: number;
    setCurrentPage: (p: number) => void;
    totalCount: number;
    totalPages: number;
    perPageData: number;
}

const BlogGridView: React.FC<BlogGridViewProps> = ({ rows, currentPage, setCurrentPage, totalCount, totalPages, perPageData }) => {
    const indexOfFirst = (currentPage - 1) * perPageData + 1;
    const indexOfLast  = Math.min(currentPage * perPageData, totalCount);

    if (rows.length === 0) return (
        <div className="text-center py-5 text-muted">
            <i className="ri-inbox-line fs-36 d-block mb-2 opacity-50" />
            <p className="mb-0">Gösterilecek kayıt bulunamadı.</p>
        </div>
    );
    const { data:brand } = useGetBrand(); 

    const defaultImgURL = "https://dummyimage.com/200x200/F3F6F9/969696&text="+brand?.companyName; 
    return (
        <>
            <Row className="gx-4 gy-3">
                {rows.map(row => {
                    const imgUrl = resolveImg(row.image);
                    const tags   = parseTags(row.tags);

                    return (
                        <Col xxl={4} lg={6} key={row.id}>
                            <div className="card border border-2 overflow-hidden h-100">
                                {imgUrl ? (
                                    <Image
                                        src={imgUrl}
                                        alt={row.title}
                                        width="100%"
                                        height={350}
                                        fallback={defaultImgURL} 
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: 350 }}>
                                        <i className="ri-image-line fs-36 text-muted opacity-50" />
                                    </div>
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fs-15">
                                        <Link to={`/blog-detail/${row.id}`} className="text-reset">{row.title}</Link>
                                    </h5>
                                    <p className="text-muted mb-2 fs-14" style={{
                                        display: '-webkit-box', WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    } as any}>
                                        {row.description}
                                    </p>
                                    {tags.length > 0 && (
                                        <div className="d-flex flex-wrap gap-1 mt-auto pt-2">
                                            {tags.map((tag: string, i: number) => (
                                                <span key={i} className="badge bg-success-subtle text-success">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                    <Link to={`/blog-detail/${row.id}`} className="text-decoration-underline small mt-2">
                                        Devamını oku <i className="ri-arrow-right-line" />
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    );
                })}
            </Row>

            <div className="row g-0 text-center text-sm-start align-items-center mb-4 mt-3">
                <div className="col-sm-6">
                    <p className="mb-sm-0 text-muted small">
                        <span className="fw-semibold">{indexOfFirst}</span>–
                        <span className="fw-semibold">{indexOfLast}</span>
                        {' '}/ toplam{' '}
                        <span className="fw-semibold text-decoration-underline">{totalCount}</span>
                    </p>
                </div>
                <div className="col-sm-6">
                    <Pagination
                        perPageData={perPageData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </>
    );
};

export default BlogGridView;