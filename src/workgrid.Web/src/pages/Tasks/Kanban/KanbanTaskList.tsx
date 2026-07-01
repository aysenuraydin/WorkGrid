import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import { Tooltip } from "antd";
import { useBoard, useDeleteCard } from "../../../hooks/useKanban";
import config from "config";
import { getAvatarColor } from "common/utils/getAvatarColor";
import { getInitials } from "common/utils/getInitials";

import { Card, CardBody } from "reactstrap"; 
import { useKanbanContext } from "../../../context/KanbanContext"; 
import DeleteModal from "components/Common/DeleteModal";
import { toast } from "react-toastify";
import { CardMember, KanbanBoardDto, KanbanCardDto } from "common/data/kanban";
import { KANBAN_STATUS_META } from "common/config/KANBAN_STATUS_META";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";
import { KanbanStatus } from "common/enums/KanbanStatus";

interface KanbanTaskListProps { projectId: string  | null}

export const KanbanTaskList: React.FC<KanbanTaskListProps> = ({ projectId }) => {
  const { data: board } = useBoard(projectId);
  const deleteCard = useDeleteCard(projectId ?? "");
  
  const { 
    openEditCard, deleteModal, openDeleteModal, closeDeleteModal, pendingDeleteId, searchText
  } = useKanbanContext();

  const filteredCards: KanbanCardDto[] = useMemo(() => {
    const all = (board ?? []).flatMap((col:KanbanBoardDto) => col.cards ?? []);
    
    if (!searchText.trim()) return all;

    const searchLower = searchText.toLowerCase();

    return all.filter((card:KanbanCardDto) => {
      const matchesTitle = card.title?.toLowerCase().includes(searchLower);
      const matchesText = card.text?.toLowerCase().includes(searchLower);
      
      const matchesBadges = (card.badges || []).some((badge: string) => 
        badge.toLowerCase().includes(searchLower)
      );

      const matchesMembers = (card.members || []).some((member: any) => 
        member.fullName?.toLowerCase().includes(searchLower)
      );

      return matchesTitle || matchesText || matchesBadges || matchesMembers;
    });
  }, [board, searchText]);
    const handleDeleteConfirm = () => {
      if (!pendingDeleteId) return;
      deleteCard.mutate(pendingDeleteId, {
        onSuccess: () => toast.success("Kart silindi."),
        onError:   () => toast.error("Silinemedi."),
      });
      closeDeleteModal();
    };

  if (!filteredCards.length) {
    return (
      <Card className="border border-1">
        <CardBody className="text-center py-5 text-muted">
          <i className="ri-sticky-note-line d-block fs-1 mb-2 opacity-50" />
          <span className="fs-14">Henüz görev yok.</span>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border border-1" id="tasksList">
      <div className="card-header border-0 d-flex align-items-center mb-2">
        <h5 className="card-title mb-0 flex-grow-1 fs-15">Tüm Görevler</h5>
        <span className="text-muted fs-12">{filteredCards.length} görev</span>
      </div>
      <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteConfirm}
          onCloseClick={closeDeleteModal}
        />

      <CardBody className="pt-0">
        <div className="table-responsive table-card">
          <table className="table align-middle table-nowrap mb-0 table-hover">
            <thead className="table-light text-muted">
              <tr>
                <th className="ps-3" style={{ width: 40 }}>#</th>
                <th>Görev</th>
                <th>Durum</th>
                <th>Öncelik</th>
                <th>Atananlar</th>
                <th>Bitiş Tarihi</th>
                <th>İlerleme</th>
                <th className="text-end pe-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card, idx) => {
                const statusMeta   = KANBAN_STATUS_META[card.status];
                const priorityInfo = PRIORITY_STATUS_META[card.priority];
                const isCompleted  = card.status === KanbanStatus.Completed;

                return (
                  <tr key={card.id} style={{ verticalAlign: "middle" }}>

                    <td className="ps-3 text-muted fs-12">{idx + 1}</td>

                    <td style={{ maxWidth: 280 }}>
                      <div
                        className="fw-medium fs-13 text-truncate"
                        style={{
                          textDecoration: isCompleted ? "line-through" : "none",
                          color: isCompleted ? "#adb5bd" : "#344054",
                        }}
                      >
                        <Link
                          to="#"
                          className="text-reset"
                          onClick={() => openEditCard(card)}
                        >
                          {card.title}
                        </Link>
                      </div>
                      {card.badges && card.badges.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {card.badges.slice(0, 3).map((b, i) => (
                            <span key={i} className="badge bg-primary-subtle text-primary fs-10" style={{ fontWeight: 500 }}>
                              {b}
                            </span>
                          ))}
                          {card.badges.length > 3 && (
                            <span className="badge bg-light text-muted fs-10">+{card.badges.length - 3}</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td>
                      <span
                        className="badge text-uppercase fs-11"
                        style={{
                          background: statusMeta?.hexBg  ?? "#f3f4f6",
                          color:      statusMeta?.hexText ?? "#6c757d",
                          padding:    "4px 10px",
                          borderRadius: 20,
                          fontWeight: 600,
                        }}
                      >
                        {statusMeta?.label ?? card.status}
                      </span>
                    </td>

                    <td>
                      {priorityInfo ? (
                        <span
                          className={`badge bg-${priorityInfo.color}-subtle text-${priorityInfo.color} text-uppercase fs-11`}
                          style={{ padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}
                        >
                          <i className="ri-flag-fill align-bottom me-1" />
                          {priorityInfo.label}
                        </span>
                      ) : (
                        <span className="text-muted fs-12">—</span>
                      )}
                    </td>

                    <td>
                      {card.members && card.members.length > 0 ? (
                        <div className="avatar-group">
                          {card.members.slice(0, 4).map((m: CardMember, key: number) => {
                            const ac = getAvatarColor(m.fullName ?? "", key);
                            return (
                              <Tooltip title={m.fullName} placement="top" key={key}>
                                <Link to={`/profile/${m.userId}`} className="avatar-group-item">
                                  {m.profilePictureUrl ? (
                                    <img
                                      src={`${config.api.FILE_API_URL}/File/${m.profilePictureUrl}`}
                                      alt={m.fullName ?? ""}
                                      className="rounded-circle avatar-xxs"
                                      style={{ border: "2px solid #fff" }}
                                    />
                                  ) : (
                                    <div className="avatar-xxs rounded-circle d-inline-block" style={{ border: "2px solid #fff" }}>
                                      <div
                                        className="avatar-title rounded-circle fs-10 fw-semibold text-uppercase"
                                        style={{ background: ac.bg, color: ac.color }}
                                      >
                                        {getInitials(m.fullName ?? "")}
                                      </div>
                                    </div>
                                  )}
                                </Link>
                              </Tooltip>
                            );
                          })}
                          {card.members.length > 4 && (
                            <Tooltip title={`${card.members.length - 4} diğer`} placement="top">
                              <Link to="#" className="avatar-group-item">
                                <div className="avatar-xxs rounded-circle d-inline-block" style={{ border: "2px solid #fff" }}>
                                  <div className="avatar-title rounded-circle bg-light text-muted fs-10">
                                    +{card.members.length - 4}
                                  </div>
                                </div>
                              </Link>
                            </Tooltip>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted fs-12">—</span>
                      )}
                    </td>

                    <td className="text-muted fs-12">
                      {card.dueDate ? (
                        <span>
                          <i className="ri-time-line align-bottom me-1" />
                          {new Date(card.dueDate).toLocaleDateString("tr-TR", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      ) : "—"}
                    </td>

                    <td style={{ minWidth: 100 }}>
                      {card.progressPercent != null ? (
                        <div>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="fs-11 text-muted">%{card.progressPercent}</span>
                          </div>
                          <div className="progress" style={{ height: 5, borderRadius: 4, background: "#f1f3f5" }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${card.progressPercent}%`,
                                borderRadius: 4,
                                background:
                                  card.progressPercent >= 90 ? "#22c55e"
                                  : card.progressPercent > 60 ? "#eab308"
                                  : card.progressPercent > 30 ? "#ea580c"
                                  : "#ef4444",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted fs-12">—</span>
                      )}
                    </td>

                    <td className="text-end pe-3">
                      <ul className="list-inline mb-0 d-flex justify-content-end gap-1">
                        <li className="list-inline-item">
                          <Tooltip title="Düzenle" placement="top">
                            <Link to={`/taskDetails/${card?.id}`}>
                                <i className="ri-eye-fill fill align-bottom text-muted fs-15" />
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="list-inline-item">
                          <Tooltip title="Düzenle" placement="top">
                            <Link to="#" onClick={() => openEditCard(card)}>
                              <i className="ri-pencil-fill align-bottom text-primary fs-15" />
                            </Link>
                          </Tooltip>
                        </li>
                        <li className="list-inline-item">
                          <Tooltip title="Sil" placement="top">
                            <Link
                              to="#"
                              className="remove-item-btn"
                              onClick={() => openDeleteModal(card.id)}
                            >
                              <i className="ri-delete-bin-fill align-bottom text-danger fs-15" />
                            </Link>
                          </Tooltip>
                        </li>
                      </ul>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};



























