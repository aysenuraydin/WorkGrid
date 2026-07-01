import React, { useEffect } from "react";
import {
  DragDropContext, Droppable, Draggable, DropResult,
} from "@hello-pangea/dnd";
import SimpleBar from "simplebar-react";
import {
  DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

import { useBoard, useMoveCard, useDeleteCard } from "../../../hooks/useKanban";
import { useKanbanContext } from "../../../context/KanbanContext";
import DeleteModal from "components/Common/DeleteModal";
import CardModal from "./CardModal";
import Loader from "components/Common/Loader";
import { KanbanCard } from "./KanbanCard";
import { KanbanStatus } from "common/enums/KanbanStatus";
import { STATUS_INDEX_MAP } from "common/config/STATUS_INDEX_MAP";
import { KanbanBoardDto, KanbanCardDto } from "common/data/kanban";
import { KANBAN_STATUS_META } from "common/config/KANBAN_STATUS_META";

interface Props { projectId: string | null; }

const KanbanBoard: React.FC<Props> = ({ projectId }) => {
  const { data: board, isLoading } = useBoard(projectId);
  const moveCard   = useMoveCard(projectId ?? "");
  const deleteCard = useDeleteCard(projectId ?? "");

  const {
    openAddCard, openEditCard, searchText,
    deleteModal, pendingDeleteId, openDeleteModal, closeDeleteModal,
  } = useKanbanContext();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;

    const rawStatus = destination.droppableId;
    const targetStatus = isNaN(Number(rawStatus))
      ? (rawStatus as KanbanStatus)
      : STATUS_INDEX_MAP[Number(rawStatus)] || KanbanStatus.New;

    moveCard.mutate(
      { id: draggableId, payload: { targetStatus, newOrder: destination.index } },
      { onError: () => toast.error("Kart taşınamadı.") }
    );
  };

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    deleteCard.mutate(pendingDeleteId, {
      onSuccess: () => toast.success("Kart silindi."),
      onError:   () => toast.error("Silinemedi."),
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
      <CardModal projectId={projectId ?? ""} />
      <div className="tasks-board mb-3 d-flex" id="kanbanboard">
        <DragDropContext onDragEnd={handleDragEnd}>
          {(board || []).map((col: KanbanBoardDto) => {
            const statusKey = isNaN(Number(col.statusValue))
              ? (col.statusValue as unknown as KanbanStatus)
              : STATUS_INDEX_MAP[Number(col.statusValue)];

            const meta = KANBAN_STATUS_META[statusKey];
            const filteredCards = (col.cards || []).filter((card: KanbanCardDto) => {
              const searchLower = searchText.toLowerCase();

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

            return (
              <div className="tasks-list" key={col.statusValue}>
                <div className="d-flex mb-3">
                  <div className="flex-grow-1">
                    <h6 className="fs-14 text-uppercase fw-semibold mb-0">
                      {meta?.label ?? col.statusName}{" "}
                      <small className={`badge ${meta?.bgClass ?? "secondary"} align-bottom ms-1 totaltask-badge`}>
                        {filteredCards?.length ?? 0} 
                      </small>
                    </h6>
                  </div>
                  <div className="flex-shrink-0">
                    <UncontrolledDropdown className="card-header-dropdown float-end">
                      <DropdownToggle
                        className="text-reset dropdown-btn"
                        tag="a"
                        color="white"
                      >
                        <span className="fw-medium text-muted fs-12">
                          Sırala <i className="mdi mdi-chevron-down ms-1" />
                        </span>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem>Önceliğe Göre</DropdownItem>
                        <DropdownItem>Tarihe Göre</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>

                <SimpleBar className="tasks-wrapper px-3 mx-n3">
                  <div className="tasks">
                    <Droppable droppableId={String(col.statusValue)}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {(filteredCards || []).map((card: KanbanCardDto, index: number) => (
                            <Draggable key={card.id} draggableId={card.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="pb-1 task-list"
                                  id={col.statusName + "-task"}
                                >
                                  <KanbanCard
                                    card={card}
                                    meta={meta}
                                    onEdit={() => openEditCard(card)}
                                    onDelete={() => openDeleteModal(card.id)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {filteredCards.length==0 &&
                            <div className="p-5"
                              style={{
                                justifyContent: "center",
                                padding: "24px 16px", 
                                border: "1px dashed rgba(0,0,0,0.06)",
                                margin: "4px 0",
                                textAlign: "center"
                              }}
                            >
                              <div className="p-3"
                                style={{ 
                                  display: "flex", 
                                  flexDirection:"column",
                                  alignItems: "center", 
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  marginBottom: 6,
                                  color: meta?.hexText,
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                                }}
                              >
                                <i className="ri-sticky-note-line" style={{ opacity: 0.8, fontSize: 25}} />
                                <span style={{ fontSize: 14}}>
                                  Henüz kart yok
                                </span>
                              </div>
                            </div>
                          }
                        </div>
                      )}
                    </Droppable>
                  </div>
                </SimpleBar>

                <div className="my-2 mt-0">
                  <button  className={`btn w-100 ${meta?.bgClass} ${meta?.hexText}`}
                    onClick={() => openAddCard(statusKey ?? KanbanStatus.New)}
                  >
                    <i className="ri-add-line align-bottom me-1" />
                    Kart Ekle
                  </button>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>

      <ToastContainer closeButton={true} limit={3} style={{marginTop:"100px"}}/>
    </>
  );
};

export default KanbanBoard;