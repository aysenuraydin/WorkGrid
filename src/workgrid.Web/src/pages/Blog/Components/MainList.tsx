import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Col, Row } from 'reactstrap'
import Pagination from 'components/Common/Pagination'
import { resolveImg, parseTags, formatDate } from './BlogHelpers'
import { useGetBrand } from 'hooks/useBrand'
import { WGBlog } from 'common/data/blog'
import { Image } from 'antd';

interface MainListProps {
    rows: any[];
    currentPage: number;
    setCurrentPage: (p: number) => void;
    totalCount: number;
    totalPages: number;
    perPageData: number;
}

const BlogCard: React.FC<{ row: WGBlog}> = ({ row }) => {
    const imgUrl      = resolveImg(row.image);
    const tags        = parseTags(row.tags);
    const date        = formatDate(row.createdAt);

    const { data:brand } = useGetBrand();
    const defaultImgURL = "https://dummyimage.com/200x100/F3F6F9/969696&text="+brand?.companyName; 
    
    return (
        <Col xxl={12}>
            <Card className="shadow-sm border-0 mb-0">
                <CardBody className='border border-2'>
                    <div className="row g-4 align-items-start">
                        <div className="col-xxl-3 col-lg-4 col-md-5">
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
                                <div className="rounded bg-light d-flex align-items-center justify-content-center w-100"
                                    style={{ height: 350 }}>
                                    <i className="ri-image-line fs-36 text-muted opacity-50" />
                                </div>
                            )}
                        </div>
                        <div className="col-xxl-9 col-lg-8 col-md-7">
                            <Link to={`/blog-detail/${row.id}`} className="text-reset">
                                <h5 className="fs-15 fw-semibold mb-2">
                                    {row.title || <span className="text-muted fst-italic">Başlıksız</span>}
                                </h5>
                            </Link>
                            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap text-muted small">
                                {date && <span><i className="ri-calendar-event-line me-1" />{date}</span>}
                                <span className="opacity-50">|</span>
                                <Link to="/pages-profile" className="text-muted text-decoration-none">
                                    <i className="ri-user-3-line me-1" />{row.createdBy ?? "Admin "}
                                </Link>
                                {row.views != null && (
                                    <>
                                        <span className="opacity-50">|</span>
                                        <span><i className="ri-eye-line me-1" />{row.views}</span>
                                    </>
                                )}
                            </div>
                            {row.description && (
                                <p className="text-muted mb-2 fs-14" style={{
                                    display: '-webkit-box', WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                } as any}>
                                    {row.description}
                                </p>
                            )}
                            <Link  to={`/blog-detail/${row.id}`} className="text-decoration-underline small text-primary">
                                Devamını oku <i className="ri-arrow-right-line" />
                            </Link>
                            {tags.length > 0 && (
                                <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                                    {tags.map((tag: string, i: number) => (
                                        <Link key={i} to="#!" className="badge bg-success-subtle text-success">{tag}</Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
};

const MainList: React.FC<MainListProps> = ({ rows, currentPage, setCurrentPage, totalCount, totalPages, perPageData }) => {
    const indexOfFirst = (currentPage - 1) * perPageData + 1;
    const indexOfLast  = Math.min(currentPage * perPageData, totalCount);

    if (rows.length === 0) return (
        <div className="text-center py-5 text-muted">
            <i className="ri-inbox-line fs-36 d-block mb-2 opacity-50" />
            <p className="mb-0">Gösterilecek kayıt bulunamadı.</p>
        </div>
    );

    return (
        <>
            <Row className="gx-4 gy-3">
                {rows.map(row => <BlogCard key={row.id} row={row} />)}
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

export default MainList;