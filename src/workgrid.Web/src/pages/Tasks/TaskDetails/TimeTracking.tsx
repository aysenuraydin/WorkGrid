
import { useEffect, useMemo } from 'react';
import { Card, CardBody, DropdownItem, DropdownMenu, DropdownToggle,UncontrolledDropdown } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import { useBoard, useCard, useDeleteCard } from 'hooks/useKanban';
import CardModal from '../Kanban/CardModal';
import { useProjectById } from 'hooks/useProjects';
import { getInitials, getInitialsName } from 'common/utils/getInitials';
import config from 'config';
import { getAvatarColor } from 'common/utils/getAvatarColor';
import Loader from 'components/Common/Loader';
import DeleteModal from 'components/Common/DeleteModal';
import { useKanbanContext } from 'context/KanbanContext';
import { toast } from 'react-toastify';
import { PRIORITY_STATUS_META } from 'common/config/PRIORITY_STATUS_META';
import { KANBAN_STATUS_META } from 'common/config/KANBAN_STATUS_META';
import { KanbanStatus } from 'common/enums/KanbanStatus';
import { Priority } from 'common/enums/Priority';
import { calculateRemainingTime } from './calculateRemainingTime';
import { CardMember } from 'common/data/kanban';


export const TimeTracking = () => {
    const { id } = useParams<{ id: string }>(); 
    const { data: card, isLoading } = useCard(id ?? "");
    const { data: project, isLoading: isProjectId } = useProjectById(card?.projectId ?? "");

    const priorityInfo = PRIORITY_STATUS_META[card?.priority as Priority];
    const statusInfo = KANBAN_STATUS_META[card?.status as KanbanStatus];

    const timeInfo = useMemo(() => {
        return calculateRemainingTime(card?.dueDate);
    }, [card?.dueDate]);

    const deleteCard = useDeleteCard(card?.projectId ?? "");

    const {
        openAddCard, openEditCard,
        deleteModal, pendingDeleteId, openDeleteModal, closeDeleteModal,
    } = useKanbanContext();

    const handleDeleteConfirm = () => {
        if (!pendingDeleteId) return;
        deleteCard.mutate(pendingDeleteId, {
            onSuccess: () => toast.success("Kart başarıyla silindi."),
            onError:   () => toast.error("Kart silinemedi, lütfen tekrar deneyin."),
        });
        closeDeleteModal();
    };

    if (isLoading) return <div className="pt-4"> <Loader isText={true} /> </div>;  

    return (
        <>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteConfirm}
                onCloseClick={closeDeleteModal}
            />
            <CardModal projectId={card?.projectId ?? ""} />
            <Card className="border border-2 mb-3">
                <CardBody className="text-center">
                    <h6 className="card-title mb-3 flex-grow-1 text-start">Süre Takibi</h6>
                    
                    {!timeInfo.hasValue && (
                        <>
                            <div className="mb-2">
                                <i className="ri-time-line display-4 text-muted"></i>
                            </div>
                            <h3 className="mb-1 text-muted">—</h3>
                            <h5 className="fs-13 text-muted mb-0">Bitiş Tarihi Belirtilmedi</h5>
                        </>
                    )}

                    {timeInfo.hasValue && timeInfo.isExpired && (
                        <>
                            <div className="mb-2">
                                <i className="ri-alarm-warning-line display-4 text-danger animate-pulse"></i>
                            </div>
                            <h3 className="mb-1 fw-bold text-danger">{timeInfo.remainingText}</h3>
                            <h5 className="fs-13 text-muted mb-3">Son Tarih: {timeInfo.formattedDate}</h5>
                            <span className="badge bg-danger-subtle text-danger px-2 py-1 fs-11 rounded-pill">
                                <i className="ri-error-warning-line me-1 align-middle"></i> Süresi Doldu
                            </span>
                        </>
                    )}

                    {timeInfo.hasValue && !timeInfo.isExpired && (
                        <>
                            <div className="mb-2">
                                <i className="ri-time-line display-4 text-success"></i>
                            </div>
                            <h3 className="mb-1 fw-semibold text-dark">{timeInfo.remainingText}</h3>
                            <h5 className="fs-13 text-muted mb-3">Son Tarih: {timeInfo.formattedDate}</h5>
                            <span className="badge bg-success-subtle text-success px-2 py-1 fs-11 rounded-pill">
                                <i className="ri-hourglass-fill me-1 align-middle"></i> Kalan Süre
                            </span>
                        </>
                    )}
                </CardBody>
            </Card>

            <div className="w-100 mb-3 d-flex gap-2">
                <button type="button" onClick={() => openEditCard(card!)} className="btn btn-soft-primary btn-sm w-100">
                    <i className="ri-pencil-fill me-1 align-bottom"></i> Düzenle
                </button>
                <button type="button" onClick={() => openDeleteModal(card?.id!, true)} className="btn btn-soft-danger btn-sm w-100">
                    <i className="ri-delete-bin-line me-1 align-bottom"></i> Sil
                </button>
            </div>

            <Card className="mb-3 border border-2">
                <CardBody>
                    <div className="table-card">
                        <table className="table mb-0">
                            <tbody>
                                <tr>
                                    <td className="fw-medium">Görev Başlığı</td>
                                    <td>{card?.title}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Proje Adı</td>
                                    <td>{project?.name}</td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Öncelik</td>
                                    <td>
                                        <span className={`badge bg-${priorityInfo?.color}-subtle text-${priorityInfo?.color} fs-11 fw-medium`} style={{ padding: "3px 8px", borderRadius: 20 }}>
                                            <i className="ri-flag-fill align-bottom me-1" />
                                            {priorityInfo?.label || card?.priority}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Durum</td>
                                    <td>
                                        <span className={`badge me-1 ${statusInfo?.bgClass}`}>
                                            {statusInfo?.icon && <i className={`${statusInfo?.icon} align-bottom me-1`} />}
                                            {statusInfo?.label || card?.status}
                                        </span>  
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fw-medium">Son Tarih</td>
                                    <td>
                                        {card?.dueDate ? (
                                            new Date(card.dueDate).toLocaleDateString("tr-TR", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            })
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex mb-3">
                        <h6 className="card-title mb-0 flex-grow-1">Atananlar</h6>
                    </div>
                    <ul className="list-unstyled vstack gap-3 mb-0">
                        {card?.members && card.members.map((m: CardMember, i: number) => {
                            const ac = getAvatarColor(m.fullName ?? "Kullanıcı", i);
                            return (
                                <li key={i}>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            {m.profilePictureUrl ? (
                                                <img src={`${config.api.FILE_API_URL}/File/${m.profilePictureUrl}`} className="rounded-circle" style={{ width: 24, height: 24, objectFit: "cover" }} alt="profil" />
                                            ) : (
                                                <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, background: ac.bg, color: ac.color, fontSize: 10, fontWeight: 600 }}>
                                                    {getInitials(m.fullName ?? "")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow-1 ms-2">
                                            <h6 className="mb-1">
                                                <Link to={`/profile/${m.userId}`}>{m.fullName}</Link>
                                            </h6>
                                            <p className="text-muted mb-0">Üye</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <Card>
                <CardBody>
                    <h5 className="card-title mb-3">Ekler</h5>
                    {/* ... (Dosya listeleme kısmını benzer şekilde "Yeniden Adlandır", "Sil" olarak güncelleyebilirsiniz) */}
                </CardBody>
            </Card>
        </>
    );
}; 