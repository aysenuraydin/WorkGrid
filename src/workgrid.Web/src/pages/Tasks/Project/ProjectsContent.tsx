import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, CardBody,
  DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown,
  Spinner,
} from "reactstrap";
import { toast } from "react-toastify";
import DeleteModal from "components/Common/DeleteModal";

import { useProjectContext } from "../../../context/ProjectContext";
import { useUserProjects, useDeleteProject, useAllProjects } from "../../../hooks/useProjects";
import ProjectModal from "./ProjectModal";
import { useAuth } from "context/AuthContext";
import { ProjectCard } from "./ProjectCard";
import { ProjectStatus } from "common/enums/ProjectStatus";
import { Priority } from "common/enums/Priority";
import { ProjectDto } from "common/data/project";
import { PROJECT_STATUS_META } from "common/config/PROJECT_STATUS_META";
import { PRIORITY_STATUS_META } from "common/config/PRIORITY_STATUS_META";

export const ProjectsContent: React.FC = () => { 
  const { data: projects, isLoading: isUserLoading } = useUserProjects();
  const { data: allProjects, isLoading: isAllLoading } = useAllProjects();
  const { user } = useAuth();
  const deleteProject = useDeleteProject();
  
  const [isAll, setIsAll] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus >("" as ProjectStatus);
  const [selectedPriority, setSelectedPriority] = useState<Priority >("" as Priority);
  
  const [list, setList] = useState<ProjectDto[]>([]);

  useEffect(() => {
    const baseList = isAll ? allProjects : projects;
    const filtered = (baseList || []).filter((project: ProjectDto) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const nameMatch = project.name?.toLowerCase().includes(searchLower);
      const descMatch = project.description?.toLowerCase().includes(searchLower);
      const matchesSearch = !searchLower || nameMatch || descMatch;

      const matchesStatus = !selectedStatus || project.status === selectedStatus;
      const matchesPriority = !selectedPriority || project.priority === selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
    setList(filtered);
  }, [isAll, projects, allProjects, searchTerm, selectedStatus, selectedPriority]);

  const {
    openCreateModal, openEditModal,
    deleteModal, pendingDeleteId, openDeleteModal, closeDeleteModal,
  } = useProjectContext();

  const handleDeleteConfirm = () => {
    if (!pendingDeleteId) return;
    deleteProject.mutate(pendingDeleteId, {
      onSuccess: () => toast.success("Proje başarıyla silindi."),
      onError:   () => toast.error("Proje silinirken bir hata oluştu."),
    });
    closeDeleteModal();
  };

  const isDataLoading = isAll ? isAllLoading : isUserLoading;
  
  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteConfirm}
        onCloseClick={closeDeleteModal}
      />
      <ProjectModal />

      <Card className="border border-2">
        <CardBody>
          <Row className="g-2 align-items-center">

            {user?.roles[0] === "Admin" || user?.roles[0] === "WG" &&
              <div className="col-lg-auto col-12">
                <button className="btn btn-primary w-100" onClick={openCreateModal}>
                  <i className="ri-add-line align-bottom me-1"></i> Proje Oluştur
                </button>
              </div>
            }

            <div className="col-lg-3 col-sm-6 col-12">
              <div className="search-box position-relative">
                <input 
                  type="text" 
                  className="form-control search pe-5" 
                  id="search-task-options" 
                  placeholder="Proje adı veya açıklama ara..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="ri-search-line search-icon"></i>
                
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                    onClick={() => setSearchTerm("")}
                    style={{ padding: "0.5rem 0.75rem", zIndex: 4, boxShadow: "none" }}
                  >
                    <i className="ri-close-fill fs-16"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="col-lg-auto col-sm-3 col-6">
              <UncontrolledDropdown>
                <DropdownToggle 
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedStatus ? "btn-soft-success" : "btn-light"
                  }`}
                >
                  <span className="text-truncate">
                    {selectedStatus ? `Statü: ${PROJECT_STATUS_META[selectedStatus]?.label || selectedStatus}` : "Tüm Statüler"}
                  </span>
                  <i className="ri-arrow-down-s-line ms-1" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-start shadow border-0">
                  <DropdownItem onClick={() => setSelectedStatus("" as ProjectStatus)} active={selectedStatus === "" as ProjectStatus}>
                    Tüm Statüler (Temizle)
                  </DropdownItem>
                  <DropdownItem divider />
                  {Object.keys(PROJECT_STATUS_META).map((statusKey) => (
                    <DropdownItem 
                      key={statusKey} 
                      onClick={() => setSelectedStatus(statusKey as ProjectStatus)}
                      active={selectedStatus === statusKey}
                    >
                      <i className={`${PROJECT_STATUS_META[statusKey as ProjectStatus]?.icon} me-2 align-middle`} style={{ color: PROJECT_STATUS_META[statusKey as ProjectStatus]?.color }} />
                      {PROJECT_STATUS_META[statusKey as ProjectStatus]?.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="col-lg-auto col-sm-3 col-6">
              <UncontrolledDropdown>
                <DropdownToggle 
                  className={`btn w-100 d-flex justify-content-between align-items-center ${
                    selectedPriority ? "btn-soft-warning" : "btn-light"
                  }`}
                >
                  <span className="text-truncate">
                    {selectedPriority ? `Öncelik: ${PRIORITY_STATUS_META[selectedPriority]?.label || selectedPriority}` : "Tüm Öncelikler"}
                  </span>
                  <i className="ri-arrow-down-s-line ms-1" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-start shadow border-0">
                  <DropdownItem onClick={() => setSelectedPriority("" as Priority)} active={selectedPriority === "" as Priority}>
                    Tüm Öncelikler (Temizle)
                  </DropdownItem>
                  <DropdownItem divider />
                  {Object.keys(PRIORITY_STATUS_META).map((priorityKey) => (
                    <DropdownItem 
                      key={priorityKey} 
                      onClick={() => setSelectedPriority(priorityKey  as Priority)}
                      active={selectedPriority === priorityKey}
                    >
                      <i className={`ri-flag-fill me-2 align-middle text-${PRIORITY_STATUS_META[priorityKey as Priority]?.color}`} />
                      {PRIORITY_STATUS_META[priorityKey  as Priority]?.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            <div className="col-auto ms-sm-auto col-12 col-sm-auto text-end">
              {(user?.roles[0] === "Admin" || user?.roles[0] === "WG") && (
                <button className="btn btn-primary w-100 w-sm-auto" onClick={() => setIsAll(prev => !prev)}>
                  {isAll ? "Projelerim" : "Tüm Projeler"}
                  <i className="ri-arrow-right-line align-middle ms-1" style={{ fontSize: 13 }} />
                </button>
              )}
            </div>
          </Row>
        </CardBody>
      </Card>

      {isDataLoading ? (
        <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "200px" }}>
          <div className="text-center">
            <Spinner color="primary" className="mb-2" />
            <p className="text-muted mb-0 fs-13">Projeler yükleniyor...</p>
          </div>
        </div>
      ) : list.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5">
          <CardBody>
            <div className="avatar-md bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3">
              <i className="ri-folder-open-line fs-2 text-muted" />
            </div>
            <h5 className="fs-16 fw-semibold mb-1">
              {(searchTerm || selectedStatus || selectedPriority) ? "Eşleşen proje bulunamadı" : "Henüz hiç projeniz yok"}
            </h5>
            <p className="text-muted max-w-sm mx-auto mb-4 fs-13">
              {(searchTerm || selectedStatus || selectedPriority)
                ? "Filtreleri sıfırlayarak veya arama kelimesini değiştirerek tekrar deneyebilirsiniz." 
                : "İşlerinizi organize etmek, kanban board'u yönetmek ve ekibinizle çalışmak için ilk projeyi şimdi başlatın."}
            </p>
            {(searchTerm || selectedStatus || selectedPriority) ? (
              <button 
                className="btn btn-soft-danger shadow-sm" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("" as ProjectStatus);
                  setSelectedPriority(""  as Priority);
                }}
              >
                <i className="ri-refresh-line align-bottom me-1" /> Tüm Filtreleri Sıfırla
              </button>
            ) : (
              <button className="btn btn-primary shadow-sm" onClick={openCreateModal}>
                <i className="ri-add-line align-bottom me-1" /> İlk Projeyi Oluştur
              </button>
            )}
          </CardBody>
        </Card>
      ) : (
        <Row className="g-4">
          {list.map((project: ProjectDto) => (
            <Col xl={4} lg={6} key={project.id}>
              <ProjectCard
                project={project}
                onEdit={() => openEditModal(project)}
                onDelete={() => openDeleteModal(project.id)}
              />
            </Col>
          ))}
        </Row>
      )}

      <div className="p-3 mt-4">
        Listelenen Proje Sayısı: {list.length}
      </div>
    </>
  );
};
