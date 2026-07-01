import React from "react";
import { Card, CardBody, Row, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { useProjectById } from "hooks/useProjects";
import config from "config";
import { getAvatarColor } from "common/utils/getAvatarColor";
import { getInitials } from "common/utils/getInitials";
import { useKanbanContext } from "context/KanbanContext";
import { View } from "../Kanban/KanbanPageContent";
import { PROJECT_STATUS_META } from "common/config/PROJECT_STATUS_META";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";
import { ProjectStatus } from "common/enums/ProjectStatus";
import { Priority } from "common/enums/Priority";
import { ProjectMemberDto } from "common/data/project";
import { KanbanStatus } from "common/enums/KanbanStatus";

interface Props { 
  projectId: string | null; 
  setView:React.Dispatch<React.SetStateAction<View>>, 
  view:View 
}

const ProjectSelector: React.FC<Props> = ({ projectId, setView, view }) => {
  const { data: project, isLoading: isLoading } = useProjectById(projectId ??"");
  const statusInfo = PROJECT_STATUS_META[project?.status as ProjectStatus];
  const priorityInfo = PRIORITY_STATUS_META[project?.priority as Priority];

  const {
    openAddCard,searchText, setSearchText,
  } = useKanbanContext();
  return (
    <>
      <Card className="border border-2 mb-3">
        <CardBody>
          <div className="g-2 d-flex justify-content-between align-items-center">
            <div className="d-flex"> 
              <div className="pt-2">
                <span className="me-2 text-uppercase">{project?.name}</span>
                <span  className="badge me-1"
                  style={{ 
                    backgroundColor: statusInfo?.bg, 
                    color: statusInfo?.color,
                  }}>
                    {statusInfo?.icon && <i className={`${statusInfo?.icon} align-bottom me-1`} />}
                    {statusInfo?.label || project?.status}
                  </span>  

                  <span className={`badge bg-${priorityInfo?.color}-subtle text-${priorityInfo?.color} fs-11 fw-medium`} style={{ padding: "3px 8px", borderRadius: 20 }}>
                    <i className="ri-flag-fill align-bottom me-1" />
                    {priorityInfo?.label || project?.priority}
                  </span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div className="avatar-group" id={`avatar-group-${project?.id}`}>
                {(project?.members || []).slice(0, 4).map((item: ProjectMemberDto, key: number) => {
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

                {project?.members && project?.members.length > 4 && (
                  <Tooltip title={`${project?.members.length - 4} diğer üye daha`} placement="top">
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
              <div className="search-box">
                <input
                  type="text"
                  className="form-control search form-control-sm"
                  placeholder="Görevlerde ara..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <i className="ri-search-line search-icon" />
              </div>
              <div className="d-flex gap-2 align-items-center">
                <button
                  type="button"
                  className="btn btn-sm btn-primary btn-sm"
                  onClick={() => openAddCard(KanbanStatus.New)}
                >
                  <i className="ri-add-line align-bottom me-1" />
                  Yeni Görev Ekle
                </button>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${view === "board" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setView("board")}
                  >
                    <i className="ri-layout-column-line align-bottom" />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setView("list")}
                  >
                    <i className="ri-list-check align-bottom" />
                  </button>
                </div>
                
                <Link className="btn btn-sm btn-primary w-sm-auto" to={"/projects"}>
                  Projelerim
                  <i className="ri-arrow-right-line align-middle ms-1" style={{ fontSize: 13 }} />
                </Link>
              </div>

            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ProjectSelector;
