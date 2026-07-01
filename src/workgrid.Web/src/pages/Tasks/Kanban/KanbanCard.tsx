import React, { useEffect } from "react";
import { CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import {
  DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown,
} from "reactstrap";
import config from "config";
import { Tooltip } from "antd";
import { getAvatarColor } from "common/utils/getAvatarColor";
import { getInitials } from "common/utils/getInitials";
import { CardMember, KanbanCardDto } from "common/data/kanban";
import { KanbanStatus } from "common/enums/KanbanStatus";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";

interface KanbanCardProps {
  card: KanbanCardDto;
  meta: any;
  onEdit: () => void;
  onDelete: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ card, onEdit, onDelete }) => {
  const isCompleted = card.status === KanbanStatus.Completed;
  const priorityInfo = PRIORITY_STATUS_META[card.priority];

  return (
    <div className="card task-box border border-2 shadow shadow-lg" id="uptask-1">
      <CardBody>
        <div className="d-flex align-items-center mb-2">
          <div className="text-muted fw-medium fs-14 flex-grow-1 d-flex align-items-center">
              <div className="d-inline mb-0">
                <h6 className="fs-15 mb-0 flex-grow-1 text-truncate task-title">
                  <Link
                    to="#"
                    className="d-block"
                    id="task-name"
                    onClick={onEdit}
                  >
                    {card.title}
                    {isCompleted && (
                      <span className="text-success fw-medium fs-14 ms-2">
                        <i className="ri-checkbox-circle-fill align-bottom me-1" />
                      </span>
                    )}
                  </Link>
                </h6>
              </div>
              <div className="mb-0 ms-2">
                <span className={`badge bg-${priorityInfo?.color}-subtle text-${priorityInfo?.color} fs-11 fw-medium`} style={{ padding: "3px 8px", borderRadius: 20 }}>
                  <i className="ri-flag-fill align-bottom me-1" />
                  {priorityInfo?.label || card.priority}
                </span>
              </div>
          </div>
          
          <UncontrolledDropdown className="float-end">
            <DropdownToggle
              className="arrow-none"
              tag="a"
              color="white"
              style={{ cursor: "pointer" }}
            >
              <i className="ri-more-fill" />
            </DropdownToggle>
            <DropdownMenu
              className="dropdown-menu-end"
              positionFixed     
              style={{ zIndex: 9999 }}
            >
              <Link to={`/taskDetails/${card?.id}`} >
                <DropdownItem className="edittask-detail" >
                    <i className="ri-eye-line align-bottom me-2" />
                    Detay
                </DropdownItem>
              </Link>
              <DropdownItem className="edittask-details" onClick={onEdit}>
                <i className="ri-pencil-line align-bottom me-2 text-muted" />
                Düzenle
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem className="deletetask text-danger" onClick={onDelete}>
                <i className="ri-delete-bin-line align-bottom me-2" />
                Sil
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div> 

        {card.text && (
          <p className="text-muted">
            {card.text}
          </p>
        )}

        {card.pictureUrl && (
          <div
            className="tasks-img rounded mb-2"
            style={{
              backgroundImage: `url(${config.api.FILE_API_URL}/File/${card.pictureUrl})`,
              height: "135px",
            }}
          />
        )}

        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            {card.badges?.map((b, i) => (
              <span key={i} className="badge bg-primary-subtle text-primary me-1">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-1">
            <div className="avatar-group" id={`avatar-group-${card.id}`}>
              {(card.members || []).slice(0, 4).map((item: CardMember, key: number) => {
                const ac = getAvatarColor(item.fullName ?? "", key);

                return (
                  <Tooltip title={item.fullName} placement="top" key={key}>
                    <Link
                      to={`/profile/${item.userId}`}
                      className="avatar-group-item"
                    >
                      {item.profilePictureUrl ? (
                        <img
                          src={`${config.api.FILE_API_URL}/File/${item.profilePictureUrl}`}
                          alt={item.userId}
                          className="rounded-circle avatar-xs"
                          style={{ border: "2px solid #fff" }}
                        />
                      ) : (
                        <div className="avatar-xs rounded-circle d-inline-block" style={{ border: "2px solid #fff" }}>
                          <div
                            className="avatar-title rounded-circle fs-11 fw-semibold text-uppercase"
                            style={{ background: ac.bg, color: ac.color }}
                          >
                            {getInitials(item.fullName ?? "")}
                          </div>
                        </div>
                      )}
                    </Link>
                  </Tooltip>
                );
              })}

              {card.members && card.members.length > 4 && (
                <Tooltip title={`${card.members.length - 4} diğer üye daha`} placement="top">
                  <Link to={`/kanbanboard?projectId=${card.id}`} className="avatar-group-item">
                    <div className="avatar-xs rounded-circle d-inline-block" style={{ border: "2px solid #fff" }}>
                      <div className="avatar-title rounded-circle bg-light text-muted fs-11 fw-medium">
                        +{card.members.length - 4}
                      </div>
                    </div>
                  </Link>
                </Tooltip>
              )}
            </div>
          </div>
        </div>

      </CardBody>

      <div className="card-footer border-top-dashed">
        <div className="d-flex">
          <div className="flex-grow-1">
            {card.dueDate && (
              <span className="text-muted">
                <i className="ri-time-line align-bottom me-1" />
                {new Date(card.dueDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            <ul className="link-inline mb-0">
              {card.comments > 0 && (
                <li className="list-inline-item">
                  <Link to="#" className="text-muted">
                    <i className="ri-question-answer-line align-bottom" /> {card.comments}
                  </Link>
                </li>
              )}
              {card.attachments > 0 && ( 
                <li className="list-inline-item">
                  <Link to="#" className="text-muted">
                    <i className="ri-attachment-2 align-bottom" /> {card.attachments}
                  </Link>
                </li>
              )} 
            </ul>
          </div>
        </div>
      </div>

      {card.progressPercent != null && (
        <Tooltip title={`%${card.progressPercent}`} placement="top">
          <div 
            className="progress progress-sm" 
            style={{ 
              height: 4, 
              borderRadius: 2, 
              background: "#f3f4f6", 
              overflow: "hidden", 
              marginTop: 8,
              cursor: "pointer" 
            }}
          >
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${card.progressPercent}%`,
                height: "100%",
                transition: "width 0.3s ease, background-color 0.3s ease",
                background: card.progressPercent >= 90 ? "#22c55e" 
                          : card.progressPercent > 60  ? "#eab308" 
                          : card.progressPercent > 30  ? "#ea580c" 
                          : "#ef4444"
              }}
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
};