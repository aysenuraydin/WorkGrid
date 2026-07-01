import React, { useEffect, useState } from "react";
import { Row, Col, Input} from "reactstrap";
import { Link, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import SimpleBar from "simplebar-react";

import DeleteModal from "components/Common/DeleteModal";

import config from "config";
import { getAvatarColor } from "common/utils/getAvatarColor";
import { getInitials } from "common/utils/getInitials";
import { useBoard, useDeleteCard, useUpdateCard } from "hooks/useKanban";
import { useKanbanContext } from "context/KanbanContext";
import CardModal from "../Kanban/CardModal";

import taskImg from "../../../assets/images/task.png";
import { CardMember, KanbanBoardDto, KanbanCardDto, UpdateCardPayload } from "common/data/kanban";
import { KanbanStatus } from "common/enums/KanbanStatus";
import { KANBAN_STATUS_META } from "common/config/KANBAN_STATUS_META";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";
import { useUserProjects } from "hooks/useProjects";
import { useGetBrand } from "hooks/useBrand";
import useThemeMode from "hooks/useThemeMode";
import ProjectModal from "../Project/ProjectModal";
import { useProjectContext } from "context/ProjectContext";

export const ToDoListView = () => {
    const { isDark } = useThemeMode();
    const { data:brand } = useGetBrand();
    document.title = "Görev Listesi | " +(brand?.companyName || "Workgrid");

    const { activeProjectId, setActiveProjectId } = useKanbanContext();
    const [searchParams] = useSearchParams();

    const {
        openCreateModal, openEditModal
    } = useProjectContext();

    useEffect(() => {
        const urlProjectId = searchParams.get("projectId");
        if (urlProjectId && urlProjectId !== activeProjectId) {
        setActiveProjectId(urlProjectId);
        }
    }, [searchParams]);

    const { data: projects, isLoading: projectsLoading } = useUserProjects();
    const { data: board, isLoading: boardLoading }        = useBoard(activeProjectId);
    const deleteCard   = useDeleteCard(activeProjectId ?? "");
    const updateCard   = useUpdateCard(activeProjectId ?? "");

    const {
        openAddCard,
        openEditCard,
        deleteModal,
        pendingDeleteId,
        openDeleteModal,
        closeDeleteModal,
    } = useKanbanContext();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch]               = useState("");
    const [filterStatus, setFilterStatus]   = useState<string>("");
    const [filterPriority, setFilterPriority] = useState<string>("");

    const allCards: KanbanCardDto[] = (board || []).flatMap(
        (col: KanbanBoardDto) => col.cards || []
    );

    const filtered = allCards.filter((card) => {
        const matchSearch   = card.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus   = filterStatus   ? String(card.status)   === filterStatus   : true;
        const matchPriority = filterPriority ? String(card.priority) === filterPriority : true;
        return matchSearch && matchStatus && matchPriority;
    });

    const handleDeleteConfirm = () => {
        if (!pendingDeleteId) return;
        deleteCard.mutate(pendingDeleteId, {
        onSuccess: () => toast.success("Kart silindi."),
        onError:   () => toast.error("Silinemedi."),
        });
        closeDeleteModal();
    };

    const handleToggleCompleted = (card: KanbanCardDto) => {
        const isCompleted = String(card.status) === String(KanbanStatus.Completed);
        const nextStatus  = isCompleted ? KanbanStatus.Pending : KanbanStatus.Completed;

        const memberUserIds = card.members?.map((m) => m.userId) || [];

        const payload: UpdateCardPayload = {
            title: card.title,
            text: card.text ?? undefined,
            priority: card.priority,
            status: nextStatus,
            dueDate: card.dueDate ?? undefined,
            badges: card.badges || [],
            memberUserIds: memberUserIds,
            pictureUrl: card.pictureUrl ?? undefined,
            progressPercent: card.progressPercent ?? 0,
        };

        updateCard.mutate(
            {
            id: card.id,
            payload: payload,
            },
            {
            onSuccess: () =>
                toast.success(
                isCompleted ? "Görev tekrar açıldı." : "Görev tamamlandı."
                ),
            onError: () => toast.error("Durum güncellenemedi."),
            }
        );
    };

    const isLoading = projectsLoading || boardLoading;
    const activeProject = (projects || []).find((p: any) => p.id === activeProjectId);

    return (
        <>
        <DeleteModal
            show={deleteModal}
            onDeleteClick={handleDeleteConfirm}
            onCloseClick={closeDeleteModal}
        />
        <CardModal projectId={activeProjectId ?? ""} />
        <ProjectModal />
        <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>

        <div className="chat-wrapper todo-wrapper d-lg-flex gap-1 mx-n4 mt-n4 p-1">
            {sidebarOpen && (
                <div className="todo-sidebar-overlay d-lg-none" onClick={() => setSidebarOpen(false)} />
            )}

            <div className={`file-manager-sidebar-show}`}
            style={{ minWidth: 260 }}
            >
                <div className="p-4 d-flex flex-column h-100">
                    <div className="mb-3">
                        <button
                            className="btn btn-info w-100"
                            onClick={openCreateModal}
                        >
                            <i className="ri-add-line align-bottom me-1" />
                            Proje Ekle
                        </button>
                    </div>

                    <SimpleBar
                    className="px-4 mx-n4"
                    style={{ maxHeight: "calc(100vh - 420px)" }}
                    >
                    {projectsLoading ? (
                        <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-primary" />
                        </div>
                    ) : (
                        <ul className="to-do-menu list-unstyled" id="projectlist-data">
                        {(projects || []).map((project: any) => {
                            const isActive = project.id === activeProjectId;
                            return (
                            <li key={project.id}>
                                <Link
                                to="#"
                                className={`nav-link fs-14 d-flex align-items-center gap-2${
                                    isActive ? " fw-bold text-primary" : ""
                                }`}
                                onClick={() => {
                                    setActiveProjectId(project.id);
                                    setSidebarOpen(false);
                                }}
                                >
                                <i
                                    className={`ri-folder${isActive ? "-open" : ""}-fill fs-16 ${
                                    isActive ? "text-primary" : "text-muted"
                                    }`}
                                />
                                <span className="text-truncate" style={{ maxWidth: 180 }}>
                                    {project.name ?? project.title ?? "Proje"}
                                </span>
                                {isActive && (
                                    <span className="badge bg-primary-subtle text-primary ms-auto">
                                    Aktif
                                    </span>
                                )}
                                </Link>

                                {isActive && (
                                <ul className="mb-1 sub-menu list-unstyled ps-3 vstack gap-1">
                                    {Object.entries(KANBAN_STATUS_META).map(([key, meta]) => {
                                    const count = allCards.filter(
                                        (c) => String(c.status) === key
                                    ).length;
                                    return (
                                        <li key={key}>
                                        <Link
                                            to="#"
                                            className="d-flex align-items-center gap-1 py-1 text-muted fs-13"
                                            onClick={() =>
                                            setFilterStatus(
                                                filterStatus === key ? "" : key
                                            )
                                            }
                                            style={{
                                            fontWeight:
                                                filterStatus === key ? 600 : 400,
                                            color:
                                                filterStatus === key
                                                ? meta.hexText
                                                : undefined,
                                            }}
                                        >
                                            <i
                                            className="ri-stop-mini-fill fs-15"
                                            style={{ color: meta.hexText }}
                                            />
                                            {meta.label}
                                            <span className="badge bg-light text-muted ms-auto">
                                            {count}
                                            </span>
                                        </Link>
                                        </li>
                                    );
                                    })}
                                </ul>
                                )}
                            </li>
                            );
                        })}
                        </ul>
                    )}
                    </SimpleBar>

                    <div className="mt-auto text-center d-none d-lg-block pt-5">
                    <img
                        src={taskImg}
                        alt="Görevler"
                        className="img-fluid"
                        style={{ maxHeight: 120, opacity: 0.85 }}
                    />
                    </div>
                </div>
            </div>
            <div className="file-manager-content w-100 p-4 pb-0">

            <Row className="mb-4">
                <div className="col-sm order-3 order-sm-2 mt-3 mt-sm-0">
                <h5 className="fw-semibold mb-0">
                    {activeProject
                    ? activeProject.name 
                    : "Proje Seçin"}
                    {activeProject && (
                    <span className="badge bg-primary align-bottom ms-2">
                        {activeProject.cardCounts} 
                    </span>
                    )}
                </h5>
                </div>
            </Row>

            <div className={`p-3 bg-${isDark?"soft-":""}light rounded mb-4`}>
                <Row className="g-2 align-items-center">
                <Col lg="auto">
                    <Input
                    type="select"
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    >
                    <option value="">Tüm Durumlar</option>
                    {Object.entries(KANBAN_STATUS_META).map(([val, meta]) => (
                        <option key={val} value={val}>
                        {meta.label}
                        </option>
                    ))}
                    </Input>
                </Col>

                <Col lg="auto">
                    <Input
                    type="select"
                    className="form-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    >
                    <option value="">Tüm Öncelikler</option>
                    {Object.entries(PRIORITY_STATUS_META).map(([val, meta]) => (
                        <option key={val} value={val}>
                        {meta.label}
                        </option>
                    ))}
                    </Input>
                </Col>

                <Col>
                    <div className="search-box">
                    <input
                        type="text"
                        className="form-control search"
                        placeholder="Görev ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <i className="ri-search-line search-icon" />
                    </div>
                </Col>

                <Col lg="auto">
                    <button
                    className="btn btn-primary"
                    onClick={() => openAddCard(KanbanStatus.New)}
                    disabled={!activeProjectId}
                    >
                    <i className="ri-add-fill align-bottom me-1" />
                    Görev Ekle
                    </button>
                </Col>
                </Row>
            </div>

            <div
                className="todo-content position-relative px-4 mx-n4"
                id="todo-content"
            >
                {isLoading ? (
                <div id="elmLoader" className="text-center py-5">
                    <div
                    className="spinner-border text-primary avatar-sm"
                    role="status"
                    >
                    <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>
                ) : !activeProjectId ? (
                <div className="py-5 text-center">
                    <i className="ri-folder-open-line display-5 text-muted" />
                    <h5 className="mt-3 text-muted">
                        Bir proje seçin
                    </h5>
                </div>
                ) : filtered.length === 0 ? (
                <div
                    className="py-4 mt-4 text-center"
                    id="noresult"
                >
                    <i className="ri-search-line display-5 text-success" />
                    <h5 className="mt-4">Sonuç bulunamadı</h5>
                </div>
                ) : (
                <div className="todo-task" id="todo-task">
                    <div className="table-responsive">
                    <table className="table align-middle position-relative table-nowrap table-hover">
                        <thead className="table-active">
                        <tr>
                            <th scope="col">Görev Adı</th>
                            <th scope="col">Atanan Üyeler</th>
                            <th scope="col">Bitiş Tarihi</th>
                            <th scope="col">Durum</th>
                            <th scope="col">Öncelik</th>
                            <th scope="col">İlerleme</th>
                            <th scope="col">İşlemler</th>
                        </tr>
                        </thead>

                        <tbody id="task-list">
                        {filtered.map((card: KanbanCardDto) => {
                            const statusMeta   = KANBAN_STATUS_META[card.status];
                            const priorityMeta = PRIORITY_STATUS_META[card.priority];

                            const isCompleted  = String(card.status) === String(KanbanStatus.Completed);

                            return (
                            <tr key={card.id} style={{ opacity: isCompleted ? 0.72 : 1, transition: "opacity 0.2s" }}>

                                <td style={{ maxWidth: 260 }}>
                                <div className="d-flex align-items-start gap-2">

                                    <div className="flex-shrink-0 mt-1">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={isCompleted}
                                            onChange={() => handleToggleCompleted(card)}
                                            style={{
                                                width: 16,
                                                height: 16,
                                                borderRadius: 4,
                                                cursor: "pointer",
                                                accentColor: "#7f56d9",
                                                flexShrink: 0,
                                            }}
                                        />
                                    </div>

                                    <div className="flex-grow-1 overflow-hidden">
                                    <Link
                                        to="#"
                                        className="fw-medium text-body d-block text-truncate"
                                        style={{
                                            maxWidth: 220,
                                            textDecoration: isCompleted ? "line-through" : "none",
                                            color:          isCompleted ? "#9CA3AF"      : undefined,
                                            transition:     "color 0.2s, text-decoration 0.2s",
                                        }}
                                        onClick={() => openEditCard(card)}
                                    >
                                        {card.title}
                                    </Link>
                                    {card.text && (
                                        <p
                                        className="text-muted fs-12 mb-0"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical" as any,
                                            overflow: "hidden",
                                            textDecoration: isCompleted ? "line-through" : "none",
                                        }}
                                        >
                                        {card.text}
                                        </p>
                                    )}
                                    </div>
                                </div>
                                </td>

                                <td>
                                <div className="avatar-group">
                                    {(card.members || [])
                                    .slice(0, 4)
                                    .map((m: CardMember, i: number) => {
                                        const ac = getAvatarColor(
                                        m.fullName ?? "",
                                        i
                                        );
                                        return (
                                            <Link
                                            to={`/profile/${m.userId}`}
                                            className="avatar-group-item"
                                            key={i}
                                            >
                                            {m.profilePictureUrl ? (
                                                <img
                                                src={`${config.api.FILE_API_URL}/File/${m.profilePictureUrl}`}
                                                alt={m.fullName ?? ""}
                                                className="rounded-circle avatar-xxs"
                                                style={{ border: "2px solid #fff" }}
                                                />
                                            ) : (
                                                <div
                                                className="avatar-xxs rounded-circle d-inline-block"
                                                style={{ border: "2px solid #fff" }}
                                                >
                                                <div
                                                    className="avatar-title rounded-circle fs-11 fw-semibold text-uppercase"
                                                    style={{
                                                    background: ac.bg,
                                                    color: ac.color,
                                                    }}
                                                >
                                                    {getInitials(m.fullName ?? "")}
                                                </div>
                                                </div>
                                            )}
                                            </Link>
                                        );
                                    })}
                                    {card.members && card.members.length > 4 && (
                                        <span className="avatar-group-item">
                                        <div
                                            className="avatar-xxs rounded-circle d-inline-block"
                                            style={{ border: "2px solid #fff" }}
                                        >
                                            <div className="avatar-title rounded-circle bg-light text-muted fs-11 fw-medium">
                                            +{card.members.length - 4}
                                            </div>
                                        </div>
                                        </span>
                                    )}
                                </div>
                                </td>

                                <td className="text-muted fs-13">
                                {card.dueDate ? (
                                    new Date(card.dueDate).toLocaleDateString(
                                    "tr-TR",
                                    {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    }
                                    )
                                ) : (
                                    <span className="text-muted">—</span>
                                )}
                                </td>

                                <td>
                                {statusMeta ? (
                                    <span
                                    className="badge text-uppercase"
                                    style={{
                                        background: statusMeta.hexBg,
                                        color: statusMeta.hexText,
                                        padding: "4px 10px",
                                        borderRadius: 20,
                                        fontSize: 11,
                                        fontWeight: 500,
                                    }}
                                    >
                                    {statusMeta.label}
                                    </span>
                                ) : (
                                    <span className="badge bg-secondary">
                                    {card.status}
                                    </span>
                                )}
                                </td>

                                <td>
                                {priorityMeta ? (
                                    <span
                                    className={`badge bg-${priorityMeta.color}-subtle text-${priorityMeta.color} text-uppercase`}
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: 20,
                                        fontSize: 11,
                                        fontWeight: 500,
                                    }}
                                    >
                                    <i className="ri-flag-fill align-bottom me-1" />
                                    {priorityMeta.label}
                                    </span>
                                ) : (
                                    <span className="badge bg-light text-muted">
                                    {card.priority ?? "—"}
                                    </span>
                                )}
                                </td>

                                <td style={{ minWidth: 110 }}>
                                {card.progressPercent != null ? (
                                    <div
                                        style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        }}
                                    >
                                        <div
                                        style={{
                                            flex: 1,
                                            height: 5,
                                            borderRadius: 4,
                                            background: "#E5E7EB",
                                            overflow: "hidden",
                                        }}
                                        >
                                        <div
                                            style={{
                                            width: `${card.progressPercent}%`,
                                            height: "100%",
                                            borderRadius: 4,
                                            background:
                                                card.progressPercent >= 90
                                                ? "#22c55e"
                                                : card.progressPercent > 60
                                                ? "#eab308"
                                                : card.progressPercent > 30
                                                ? "#ea580c"
                                                : "#ef4444",
                                            transition: "width 0.3s ease",
                                            }}
                                        />
                                        </div>
                                        <span
                                        style={{
                                            fontSize: 11,
                                            color: "#6B7280",
                                            whiteSpace: "nowrap",
                                        }}
                                        >
                                        {card.progressPercent}%
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-muted fs-12">—</span>
                                )}
                                </td>

                                <td>
                                <div className="hstack gap-1">
                                    <Link to={`/taskDetails/${card?.id}`}
                                        className="btn btn-sm btn-soft-dark edit-list"
                                    >
                                        <i className="ri-eye-fill align-bottom" />
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-soft-primary edit-list"
                                        onClick={() => openEditCard(card)}
                                    >
                                        <i className="ri-pencil-fill align-bottom" />
                                    </button>
                                    <button
                                        className="btn btn-sm btn-soft-danger remove-list"
                                        onClick={() => openDeleteModal(card.id)}
                                    >
                                        <i className="ri-delete-bin-5-fill align-bottom" />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
        </>
    );
};