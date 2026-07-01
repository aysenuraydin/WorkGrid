import React from "react";
import {  Card, CardBody,  DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown,
} from "reactstrap";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import config from "config";
import { getAvatarColor } from "common/utils/getAvatarColor";
import { getInitials } from "common/utils/getInitials";
import { PROJECT_STATUS_META } from "common/config/PROJECT_STATUS_META";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";
import { ProjectStatus } from "common/enums/ProjectStatus";
import { Priority } from "common/enums/Priority";
import { ProjectDto, ProjectMemberDto } from "common/data/project";

interface ProjectCardProps {
  project: ProjectDto;
  onEdit: () => void;
  onDelete: () => void;
} 
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {

  const statusInfo = PROJECT_STATUS_META[project.status as ProjectStatus];
  const priorityInfo = PRIORITY_STATUS_META[project.priority as Priority];
  return (
    <Card
      className={`card-animate h-100 border shadow border-2 bg-transparent`}
      style={{
        border: "0.5px solid var(--bs-border-color)",
        borderRadius: 12,
        boxShadow: "none",
        background: "#fff",
        overflow: "visible"
      }}
      
    >
      <CardBody className="p-4 d-flex flex-column h-100 bg-transparent">

        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <div className="overflow-hidden flex-grow-1">
            <h5 className="fs-15 fw-semibold mb-0 text-truncate">
              <Link
                to={`/kanbanboard?projectId=${project.id}`}
                className="text-body text-decoration-none project-title"
              >
                {project.name}
              </Link>
            </h5>
          </div>

          <div className="flex-shrink-0 ms-2">
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="btn btn-ghost-light btn-icon btn-sm rounded-circle arrow-none text-muted" style={{ cursor: "pointer" }}>
                <i className="ri-more-2-fill fs-16" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end shadow-lg border-0 m-0" strategy="fixed">
                <DropdownItem tag={Link} to={`/kanbanboard?projectId=${project.id}`} className="py-2">
                  <i className="ri-kanban-view align-bottom me-2 text-muted fs-15" />
                  Board'u Aç
                </DropdownItem>
                <DropdownItem onClick={onEdit} className="py-2">
                  <i className="ri-pencil-line align-bottom me-2 text-muted fs-15" />
                  Düzenle
                </DropdownItem>
                <DropdownItem divider className="border-light" />
                <DropdownItem className="text-danger py-2" onClick={onDelete}>
                  <i className="ri-delete-bin-line align-bottom me-2 fs-15" />
                  Projeyi Sil
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
        <div>
          <span  className="badge me-1"
          style={{ 
            backgroundColor: statusInfo.bg, 
            color: statusInfo.color,
          }}>
            {statusInfo?.icon && <i className={`${statusInfo.icon} align-bottom me-1`} />}
            {statusInfo?.label || project.status}
          </span>  

          <span className={`badge bg-${priorityInfo?.color}-subtle text-${priorityInfo?.color} fs-11 fw-medium`} style={{ padding: "3px 8px", borderRadius: 20 }}>
            <i className="ri-flag-fill align-bottom me-1" />
            {priorityInfo?.label || project.priority}
          </span>
        </div> 

        <p className="text-muted fs-13 lh-base my-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical" as any,
            overflow: "hidden",
            minHeight: 38,
            opacity: 0.85,
          }}
        >
          {project.description || "Bu proje için henüz bir açıklama eklenmedi."}
        </p>
        <div className="mt-auto pt-1">
          <div className="avatar-group" id={`avatar-group-${project.id}`}>
            {(project.members || []).slice(0, 4).map((item: ProjectMemberDto, key: number) => {
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
                        alt={item.fullName}
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

            {project.members && project.members.length > 4 && (
              <Tooltip title={`${project.members.length - 4} diğer üye daha`} placement="top">
                <Link to={`/kanbanboard?projectId=${project.id}`} className="avatar-group-item">
                  <div className="avatar-xs rounded-circle d-inline-block" style={{ border: "2px solid #fff" }}>
                    <div className="avatar-title rounded-circle bg-light text-muted fs-11 fw-medium">
                      +{project.members.length - 4}
                    </div>
                  </div>
                </Link>
              </Tooltip>
            )}
          </div>
        </div>

        <div className={"d-flex align-items-center justify-content-between fs-12 text-muted pt-3 mt-2 border-top border-2"} >
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-1">
              <i className="ri-team-line fs-14 text-muted" />
              <span className="fw-medium text-dark">{project.members?.length || 0}</span> Üye
            </div>
            <div className="d-flex align-items-center gap-1">
              <i className="ri-task-line fs-14 text-muted" />
              <span className="fw-medium text-dark">{project.cardCounts || 0}</span> Kart
            </div>
          </div>

          <Link
            to={`/kanbanboard?projectId=${project.id}`}
            className="d-flex align-items-center gap-1 fw-semibold text-decoration-none"
            style={{ fontSize: 12, color: "var(--bs-primary)" }}
          >
            Yönet <i className="ri-arrow-right-line align-middle" style={{ fontSize: 13 }} />
          </Link>
        </div>

      </CardBody>
    </Card>
  );
};