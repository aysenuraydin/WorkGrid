import { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Container, Nav, NavItem, NavLink, Row, Badge, Alert } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";

import BreadCrumb from "components/Common/BreadCrumb";
import TableContainer from "components/Common/TableContainer";
import Loader from "components/Common/Loader";
import { PopConfirm } from "components/Common/PopConfirm";
import { ModalType } from "common/enums/ModalType";
import { useGetBrand } from "hooks/useBrand";

import { CommentItemType, Comment } from "common/data/comment";
import { useAdminComments, useDeleteComment } from "hooks/useComment";
import { useGetTable } from "hooks/useDatatables";
import { TableViewType } from "common/enums/TableViewType";
import { CommentDetailModal } from "./Components/CommentDetailModal";
import useThemeMode from "hooks/useThemeMode";

interface Props {
    itemType: CommentItemType;
    title?: string;
}

export const CommentPanel = ({ itemType, title }: Props) => {
    const { data: brand } = useGetBrand();
    const { data: comments, isLoading } = useAdminComments(itemType.toString());
    const del = useDeleteComment(String(itemType), "");
    const { id } = useParams<{ id: string }>();
    const { data: table } = useGetTable(Number(id));
    const { isDark } = useThemeMode();  

    const [tab, setTab] = useState(1);

    const [selected, setSelected] = useState<Comment | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const isRating = itemType === CommentItemType.Product;
    const pageTitle = title ?? (itemType === CommentItemType.Blog ? "Blog Yorumları" : "Ürün Yorumları");
    document.title = pageTitle + " | " + (brand?.companyName || "Workgrid");

    const openDetail = (c: Comment) => { setSelected(c); setDetailOpen(true); };

    const handleDelete = (commentId: number) => {
        del.mutate(commentId, {
        onSuccess: () => toast.success("Yorum silindi."),
        onError: () => toast.error("Yorum silinemedi."),
        });
    };

    const data = useMemo(() => {
        const list = comments?.data as (Comment & {name:string})[];
        return tab === 1 ? list : list?.filter(c => c.parentId == null);
    }, [comments, tab]);

    const columns = useMemo(() => [
        {
        header: "Id",
        accessorKey: "id",
        enableColumnFilter: false,
        cell: (c: any) => <span className="fw-medium link-primary">#{c.getValue()}</span>,
        },
        {
        header: "Blog Name",
        accessorKey: "itemName",
        enableColumnFilter: false,
        cell: (c: any) => (
            <Link to={"/blog-detail/"+c.row.original?.itemId}>
                <Badge color="soft-primary" className="text-primary">
                    {c.getValue()}{c.row.original?.name ? " ↳" : ""}
                </Badge>
            </Link>
        ),
        },
        {
        header: "Yazar",
        accessorKey: "authorName",
        enableColumnFilter: false,
        cell: (c: any) => c.getValue() ?? "Kullanıcı",
        },
        {
        header: "İçerik",
        accessorKey: "content",
        enableColumnFilter: false,
        cell: (c: any) => (
            <div style={{ maxWidth: 320, whiteSpace: "normal" }}>
            <span className="text-muted">{c.getValue()}</span>
            {c.row.original.images?.length > 0 && (
                <i className="ri-image-line ms-1 text-info" title={`${c.row.original.images.length} foto`} />
            )}
            </div>
        ),
        },
        ...(isRating ? [{
        header: "Puan",
        accessorKey: "rating",
        enableColumnFilter: false,
        cell: (c: any) => c.getValue() != null
            ? <span className="text-warning">{c.getValue()} <i className="mdi mdi-star" /></span>
            : <span className="text-muted">—</span>,
        }] : []),
        {
        header: "Tarih",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (c: any) => (
            <small className="text-muted">
            {c.getValue() ? moment.utc(c.getValue()).local().format("DD MMM YYYY HH:mm") : ""}
            </small>
        ),
        },
        {
        id: "action",
        header: "",
        cell: (c: any) => {
            const row = c.row.original as Comment;
            return (
            <div className="d-flex gap-2 justify-content-end me-1">
                <Link
                to="#"
                className="btn btn-sm btn-soft-primary btn-hover"
                onClick={(e) => { e.preventDefault(); openDetail(row); }}
                title="Görüntüle"
                >
                <i className="ri-eye-fill fs-14 text-primary" />
                </Link>
                <Link to="#" id={`comment-pop-${row.id}`} className="btn btn-sm btn-soft-danger btn-hover">
                <i className="ri-delete-bin-5-fill fs-14 text-danger" />
                </Link>
                <PopConfirm
                    targetId={`comment-pop-${row.id}`}
                    type={ModalType.Alert}
                    message="Bu yorumu silmek istediğinize emin misiniz?"
                    confirmText="Sil!"
                    onConfirm={async () => handleDelete(row.id)}
                    onClose={() => toast.error("Silinemedi!")}
                />
            </div>
            );
        },
        },
    ], [isRating]);

    return (
        <div className="page-content" style={{ userSelect: "none" }}>
        <Container fluid>
            <BreadCrumb title={pageTitle} pageTitle={brand?.companyName || "Workgrid"} />
            <Card style={{ position: "relative" }}>
            <CardHeader className="card-header btable-0">
                <Row className="align-items-center gy-3">
                <div className="col-sm">
                    <h5 className="card-title mb-0 text-capitalize">{pageTitle}</h5>
                </div>
                <div className="col-sm-auto">
                    <Badge color="light" className="text-muted">{data?.length ?? 0} yorum</Badge>
                </div>
                </Row>
            </CardHeader>

            <Nav className="nav-tabs nav-tabs-custom nav-primary px-3" role="tablist">
                <NavItem>
                <NavLink active={tab === 1} style={{ cursor: "pointer" }} onClick={() => setTab(1)}>
                    <i className="ri-grid-line" /> Tüm Yorumlar
                </NavLink>
                </NavItem>
                <NavItem>
                <NavLink active={tab === 2} style={{ cursor: "pointer" }} onClick={() => setTab(2)}>
                    <i className="ri-chat-1-line" /> Sadece Ana Yorumlar
                </NavLink>
                </NavItem>
            </Nav>

            <CardBody className="pt-0" style={{ minHeight: "65vh" }}>
                {data?.length > 0 ? (
                <TableContainer
                    columns={columns}
                    data={data}
                    isGlobalFilter
                    customPageSize={table?.data?.pageSize}
                    SearchPlaceholder="Yorum, yazar veya item ara..."
                    divClass="table-responsive table-card mb-1 pt-0 table-min-height" 
                    tableClass="align-middle table-nowrap"
                    isIcon={table?.data?.viewType == TableViewType.Grid}
                    tbl={table?.data!} 
                    theadClass={`table-${isDark ? 'dark':'light'} text-muted text-uppercase`}
                    thClass={`${isDark ? 'text-light':'text-dark'}`}
                />
                ) : (
                <>
                    {isLoading ? (
                    <div className="pt-4"><Loader isText={true} /></div>
                    ) : (
                    <div className="px-2 py-3">
                        <Alert color="danger">Yorum bulunamadı.</Alert>
                    </div>
                    )}
                </>
                )}
                <ToastContainer closeButton={true} limit={3}  style={{marginTop:"100px"}}/>
            </CardBody>
            </Card>
        </Container>

        <CommentDetailModal
            modalSize={table?.data?.modalSize!}
            isOpen={detailOpen}
            toggle={() => setDetailOpen(false)}
            comment={selected}
            isRating={isRating}
        />
        </div>
    );
};