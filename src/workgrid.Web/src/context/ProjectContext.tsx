import { ProjectDto } from "common/data/project";
import React, { createContext, useContext, useState } from "react";

interface ProjectContextValue {
  projectModal: boolean;
  isEditProject: boolean;
  activeProject: ProjectDto | null;
  openCreateModal: () => void;
  openEditModal: (project: ProjectDto) => void;
  closeProjectModal: () => void;

  deleteModal: boolean;
  pendingDeleteId: string | null;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectModal, setProjectModal]   = useState(false);
  const [isEditProject, setIsEditProject] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectDto | null>(null);

  const [deleteModal, setDeleteModal]         = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const openCreateModal = () => {
    setActiveProject(null);
    setIsEditProject(false);
    setProjectModal(true);
  };

  const openEditModal = (project: ProjectDto) => {
    setActiveProject(project);
    setIsEditProject(true);
    setProjectModal(true);
  };

  const closeProjectModal = () => {
    setProjectModal(false);
    setActiveProject(null);
  };

  const openDeleteModal = (id: string) => {
    setPendingDeleteId(id);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setPendingDeleteId(null);
  };

  return (
    <ProjectContext.Provider value={{
      projectModal, isEditProject, activeProject,
      openCreateModal, openEditModal, closeProjectModal,
      deleteModal, pendingDeleteId, openDeleteModal, closeDeleteModal,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjectContext must be used inside <ProjectProvider>");
  return ctx;
};