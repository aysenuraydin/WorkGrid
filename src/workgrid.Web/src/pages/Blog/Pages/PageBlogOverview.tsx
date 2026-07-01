import BreadCrumb from 'components/Common/BreadCrumb';
import React, { useEffect, useRef } from 'react'
import { Container } from 'reactstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';  
import { Image } from 'antd';
import { useDeleteRow, useGridbaseById, usePatchRow } from 'hooks/useGridBase';
import { useGetBrand } from 'hooks/useBrand';
import moment from 'moment';
import { useUserProfile } from 'hooks/useUser';
import { parseTags, resolveImg } from '../Components/BlogHelpers';
import { useAuth } from 'context/AuthContext'; 
import { PopConfirm } from 'components/Common/PopConfirm';
import { ModalType } from 'common/enums/ModalType';
import { toast, ToastContainer } from 'react-toastify';
import { WGBlog, WGBlogCategory } from 'common/data/blog'; 
import { CommentItemType } from 'common/data/comment';
import { CommentList } from 'pages/Comment';

const BLOG_TABLE = "WG Blog";
const CATEGORY_TABLE = "WG Blog Category";
const PageBlogOverview = () => {    
    const { id } = useParams<{ id: string }>();
    const { data: blog, isLoading } = useGridbaseById(BLOG_TABLE, Number(id)) as { data: WGBlog | undefined; isLoading: boolean };
    const { data: category  } = useGridbaseById(CATEGORY_TABLE, (blog?.wGBlogCategoryId ?? 0)) as { data: WGBlogCategory};  

    const { data: brand } = useGetBrand();

    const { user: usr } = useAuth(); 
    const { data: user, isLoading: isUserLoading } = useUserProfile(usr?.id ?? "");
    const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");
    const { data: author } = useUserProfile(blog?.createdByUserId ??"");
    const patchBlog = usePatchRow(BLOG_TABLE);
    const viewedRef = useRef<string | null>(null);
    
    useEffect(() => {
        if (!id) return;
        if (!blog?.id) return;  
        if (viewedRef.current === id) return;  
    
        viewedRef.current = id;
        const current = typeof blog.views === "number" ? blog.views : 0;
    
        patchBlog.mutate({
            id: blog.id,
            payload: { views: current + 1 },
        });
    }, [id, blog?.id]); 
    
    const navigate = useNavigate(); 
    const { mutate: deleteRow } = useDeleteRow(BLOG_TABLE);

    const handleDelete = () => {
        if (!blog?.id) return;
            deleteRow(blog.id, {
                onSuccess: () => {
                    toast.success("Blog yazısı başarıyla silindi!");
                    setTimeout(() => {
                        navigate("/blog-list");
                    }, 1000);
                },
                onError: () => toast.error("Blog silinirken bir hata oluştu.")
            });
        };

    const defaultImgURL = "https://dummyimage.com/1200x600/F3F6F9/969696&text=" + (brand?.companyName ?? "Workgrid");
    document.title = "Overview | " +(brand?.companyName || "Workgrid");

    if (isLoading) {
        return (
            <div className="page-content">
                <Container fluid>
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" />
                        <p className="text-muted mt-2 mb-0 small">Yükleniyor…</p>
                    </div>
                </Container>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Önizleme" pageTitle={brand?.companyName || "Workgrid"} />
                    <div className="text-center py-5 text-muted">
                        <i className="ri-inbox-line fs-36 d-block mb-2 opacity-50" />
                        <p className="mb-0">Blog bulunamadı.</p>
                    </div>
                </Container>
            </div>
        );
    }

    const imgUrl = resolveImg(blog.image) || defaultImgURL;
    const tags = parseTags(blog.tags);
    const date = blog.createdAt ? moment.utc(blog.createdAt).local().fromNow() : null;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Blog Detayı" pageTitle={brand?.companyName || "Workgrid"} />

                    <div className="row justify-content-center">
                        <div className="col-xxl-10">
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center mb-4"> 
                                        <p className="text-success text-uppercase mb-2">
                                        {category?.name}
                                        </p>
                                        <h4 className="mb-2">{blog.title}</h4>
                                        <p className="text-muted mb-4">{blog.description}</p>
                                        <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                                            {tags.map((tag: string, i: number) => (
                                                <span key={i} className="badge bg-primary-subtle text-primary">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <Image
                                        src={imgUrl}
                                        alt={blog.title}
                                        width="100%"
                                        height={350}
                                        fallback={defaultImgURL} 
                                        style={{ objectFit: 'cover' }}
                                        preview={true} 
                                    />

                                    <div className="row mt-4">
                                        <div className="col-lg-3">
                                            {isAdmin && (
                                                <div className='mb-3'>
                                                    <div className="d-flex gap-2 mb-3">
                                                        <Link to={`/blog-edit/${blog.id}`} className="btn btn-soft-success btn-sm">
                                                            <i className="ri-edit-line align-bottom me-1" /> Düzenle
                                                        </Link>
                                                        <button id={`blog-delete-${blog?.id}`} className="btn btn-soft-danger btn-sm">
                                                            <i className="ri-delete-bin-line align-bottom me-1" /> Sil
                                                        </button>
                                                        <PopConfirm 
                                                            targetId={`blog-delete-${blog?.id}`}
                                                            type={ModalType.Alert}
                                                            message='Bu blog yazısını silmek istediğinize emin misiniz?'
                                                            confirmText='Sil!'
                                                            onConfirm={async () => {
                                                                await handleDelete();
                                                            }} 
                                                            onClose={() => {}} 
                                                        />
                                                    </div>
                                                </div> 
                                            )}

                                            <div className="d-flex align-items-center gap-2 mb-3 flex-wrap text-muted small">
                                                {date && <span><i className="ri-calendar-event-line me-1" />{date}</span>}
                                                <span className="opacity-50">|</span>
                                                <Link to="/pages-profile" className="text-muted text-decoration-none">
                                                    <i className="ri-user-3-line me-1" /> {blog.createdBy ?? "Yönetici"}
                                                </Link>
                                                {blog.views != null && (
                                                    <>
                                                        <span className="opacity-50">|</span>
                                                        <span><i className="ri-eye-line me-1" /> {blog.views} Görüntülenme</span>
                                                    </>
                                                )}
                                            </div>

                                            <h6 className="pb-1">Yazar:</h6>
                                            <div className="d-flex gap-2 mb-3">
                                                <div className="flex-shrink-0">
                                                    <img src={author?.profilePictureUrl} alt="yazar" className="avatar-sm rounded" />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-1">
                                                        <Link to={`/profile/${author?.id}`}>{author?.firstName} {author?.lastName}</Link>
                                                    </h5>
                                                    <p className="mb-2 text-muted">İçerik Editörü</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-9">
                                            <div
                                                className="text-muted"
                                                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
                                            />
                                            <hr className="my-4" />
                                            <CommentList itemType={CommentItemType.Blog} itemId={blog.id!} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}} />
                </Container>
            </div>
        </React.Fragment>
    );
}

export default PageBlogOverview