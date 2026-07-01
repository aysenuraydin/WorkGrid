import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useKanbanContext } from "../../../context/KanbanContext";
import KanbanBoard from "./KanbanBoard";
import ProjectSelector from "../Project/ProjectSelector";
import { KanbanWidgets } from "./KanbanWidgets";
import { KanbanTaskList } from "./KanbanTaskList";
import CardModal from "./CardModal";
import { useUserProjects } from "hooks/useProjects";
import { ProjectDto } from "common/data/project";
import useThemeMode from "hooks/useThemeMode";

export type View = "board" | "list";
export const KanbanPageContent: React.FC = () => {
  const { isDark } = useThemeMode();  
  const { activeProjectId, setActiveProjectId } = useKanbanContext();
  const { data: projects, isLoading: isUserLoading } = useUserProjects();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<View>("board");

  useEffect(() => {
    const urlProjectId = searchParams.get("projectId");
    if (urlProjectId && urlProjectId !== activeProjectId) {
      setActiveProjectId(urlProjectId);
    }
  }, [searchParams]);

  return (
    <>
      <KanbanWidgets projectId={activeProjectId} />
      <ProjectSelector projectId={activeProjectId} setView={setView} view={view}/> 

      {activeProjectId ? (
        <>
          {view === "board" ? (
            <KanbanBoard projectId={activeProjectId} />
          ) : (
            <KanbanTaskList projectId={activeProjectId} />
          )}
        </>
      ) : (
        <div className="text-center py-5 px-3 mx-auto" style={{ maxWidth: "600px" }}>
          <div className="mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-circle mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="ri-kanban-view fs-24" />
            </div>
            <h4 className="fw-semibold text-dark mb-1 fs-16">Pano Görüntülenemedi</h4>
            <p className="text-muted fs-13">
              Kanban panosunu ve görevleri yüklemek için lütfen aşağıdan çalışmak istediğiniz projeyi seçin.
            </p>
          </div>

          {projects && projects.length > 0 ? (
            <div 
              className="pe-2" 
              style={{ 
                maxHeight: "280px", 
                overflowY: "auto",
                scrollbarWidth: "thin" 
              }}
            >
              <div className="d-flex flex-column gap-2">
                {projects.map((item:ProjectDto) => (
                  <Link
                    key={item.id}
                    to={`/kanbanboard?projectId=${item.id}`}
                    className={`d-flex align-items-center justify-content-between p-3 rounded-3 border bg-${isDark?"soft-":""}light text-decoration-none project-card-item transition-all link-primary`}
                  >
                    <div className="d-flex align-items-center gap-3 text-start min-w-0">
                      <div 
                        className="bg-light text-muted rounded-2 d-flex align-items-center justify-content-center fw-bold fs-12 text-uppercase"
                        style={{ width: "36px", height: "36px", minWidth: "36px" }}
                      >
                        {item.name ? item.name.substring(0, 2) : "PR"}
                      </div>
                      <div className="text-truncate">
                        <h5 className="fs-14 fw-semibold text-dark mb-0 text-truncate">
                          {item.name}
                        </h5>
                        <span className="text-muted fs-11">Projeyi açmak için tıklayın</span>
                      </div>
                    </div>
                    
                    <div className="text-muted ps-2">
                      <i className="ri-arrow-right-s-line fs-18" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-muted fs-13 py-3">
              <i className="ri-folder-warning-line me-1 align-bottom" /> Aktif projeniz bulunmamaktadır.
            </div>
          )}
        </div>
              )}
              <CardModal projectId={activeProjectId ?? ""} />
      </>
  );
};