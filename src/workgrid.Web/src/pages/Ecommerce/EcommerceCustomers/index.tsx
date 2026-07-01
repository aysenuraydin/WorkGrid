import React, { useMemo, useState } from "react";
import {
  Container, Row, Col, Card, CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify";

import DeleteModal from "components/Common/DeleteModal";
import BreadCrumb from "components/Common/BreadCrumb";
import ExportCSVModal from "components/Common/ExportCSVModal";
import TableContainer from "components/Common/TableContainer";
import Loader from "components/Common/Loader";
import { useGetBrand } from "hooks/useBrand";
import { useGetRoleUsersAll } from "hooks/useRole";
import config from "config";
import { useSetUserBlocked } from "hooks/useAuthentication";
import { useDeleteUser } from "hooks/useUser";
import useThemeMode from "hooks/useThemeMode";

const initials = (firstName?: string, lastName?: string) => {
  const f = (firstName ?? "").charAt(0);
  const l = (lastName ?? "").charAt(0);
  return (f + l).toUpperCase() || "?";
};

const EcommerceCustomers = () => { 
  const { isDark } = useThemeMode(); 
  const { data: brand } = useGetBrand();
  document.title = "Customers | " + (brand?.companyName || "Workgrid");

  const { data: users, isLoading } = useGetRoleUsersAll();
  const setBlocked = useSetUserBlocked();
  const deleteUser = useDeleteUser();

  // ── Sil modalı ──
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);

  const onClickDelete = (user: any) => {
    setDeletingUser(user);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (!deletingUser?.id) return;
    deleteUser.mutate(deletingUser.id, {
      onSuccess: () => { toast.success("Kullanıcı silindi."); setDeleteModal(false); },
      onError: () => toast.error("Kullanıcı silinemedi."),
    });
  };

  // ── Block / Unblock ──
  const toggleBlock = (user: any) => {
    const willBlock = !user.isBlocked;
    setBlocked.mutate(
      { id: user.id, blocked: willBlock },
      {
        onSuccess: () =>
          toast.success(willBlock ? "Kullanıcı bloklandı." : "Kullanıcı blok açıldı."),
        onError: () => toast.error("İşlem başarısız."),
      }
    );
  };

  // ── Export ──
  const [isExportCSV, setIsExportCSV] = useState(false);

  const columns = useMemo(
    () => [
      {
        header: "Müşteri",
        accessorKey: "firstName",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const u = cell.row.original;
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-xs rounded-circle flex-shrink-0">
                {u.profilePictureUrl ? (
                  <img
                    src={`${config.api.FILE_API_URL}/File/${u.profilePictureUrl}`}
                    alt=""
                    className="img-fluid rounded-circle"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="avatar-title rounded-circle bg-light text-primary fs-12">
                    {initials(u.firstName, u.lastName)}
                  </div>
                )}
              </div>
              <Link to={`/profile/${u.id}`} className="text-body fw-medium">
                {u.firstName} {u.lastName}
              </Link>
            </div>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Kullanıcı Adı",
        accessorKey: "username",
        enableColumnFilter: false,
        cell: (cell: any) => cell.getValue() ?? "—",
      },
      {
        header: "Roller",
        accessorKey: "roles",
        enableColumnFilter: false,
        cell: (cell: any) => {
          const roles: string[] = cell.getValue() ?? [];
          if (roles.length === 0) return <span className="text-muted">—</span>;
          return (
            <div className="d-flex flex-wrap gap-1">
              {roles.map((r, i) => (
                <span key={i} className="badge bg-primary-subtle text-primary">{r}</span>
              ))}
            </div>
          );
        },
      },
      {
        header: "Durum",
        accessorKey: "isBlocked",
        enableColumnFilter: false,
        cell: (cell: any) =>
          cell.getValue() ? (
            <span className="badge text-uppercase bg-danger-subtle text-danger">Bloklu</span>
          ) : (
            <span className="badge text-uppercase bg-success-subtle text-success">Aktif</span>
          ),
      },
      {
        header: "İşlem",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps: any) => {
          const user = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="Profil">
                <Link to={`/profile/${user.id}`} className="text-primary d-inline-block">
                  <i className="ri-user-3-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title={user.isBlocked ? "Blok Aç" : "Blokla"}>
                <Link
                  to="#"
                  className={`d-inline-block ${user.isBlocked ? "text-success" : "text-warning"}`}
                  onClick={(e) => { e.preventDefault(); toggleBlock(user); }}
                >
                  <i className={`fs-16 ${user.isBlocked ? "ri-lock-unlock-line" : "ri-lock-line"}`}></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Sil">
                <Link
                  to="#"
                  className="text-danger d-inline-block"
                  onClick={(e) => { e.preventDefault(); onClickDelete(user); }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    // eslint-disable-next-line
    []
  );

  return (
    <React.Fragment>
      <div className="page-content" style={{ userSelect: "none", overflowX: "hidden" }}>
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={users ?? []}
        />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDelete}
          onCloseClick={() => setDeleteModal(false)}
        />

        <Container fluid>
          <BreadCrumb title="Müşteriler" pageTitle={brand?.companyName || "Workgrid"} />
          <Row>
            <Col lg={12}>
              <Card id="customerList" className="border border-2">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <h5 className="card-title mb-0">Kullanıcı Listesi</h5>
                    </div>
                    <div className="col-sm-auto">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsExportCSV(true)}>
                        <i className="ri-file-download-line align-bottom me-1"></i> Export
                      </button>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  {isLoading ? (
                    <Loader />
                  ) : (users && users.length) ? (
                    <TableContainer
                      columns={columns}
                      data={users || []}
                      isGlobalFilter={true}
                      customPageSize={10}
                      SearchPlaceholder="İsim, email, kullanıcı adı veya durum ara..."
                      divClass="table-responsive table-card mb-1 pt-0 table-min-height"
                      theadClass={`table-responsive table-${isDark ? 'dark':'light'} text-muted text-uppercase`}
                      thClass={`${isDark ? 'text-light':'text-dark'}`}
                    />
                  ) : (
                    <div className="text-center py-5">
                      <i className="ri-user-line display-5 text-muted" />
                      <h5 className="mt-3">Kullanıcı bulunamadı</h5>
                    </div>
                  )}

                  <ToastContainer closeButton={true} limit={3} style={{ marginTop: "100px" }} />
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceCustomers;