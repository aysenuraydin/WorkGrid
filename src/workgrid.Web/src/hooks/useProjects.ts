import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getProjects, 
    getUserProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject 
} from "helpers/backend_helper";
import { CreateProjectRequest, UpdateProjectRequest } from "common/data/project";

export const allProjectsKey = () => ["allProjects"] as const;
export const projectsKey = () => ["projects"] as const;
export const projectKey = (id: string) => ["project", id] as const;

export const useUserProjects = () =>
  useQuery({
    queryKey: projectsKey(),
    queryFn: getUserProjects,        
    staleTime: 1000 * 60 * 5,  
    gcTime: 1000 * 60 * 10,  
    refetchOnWindowFocus: false,  
    placeholderData: (previousData) => previousData, 
  });

export const useAllProjects = () =>
  useQuery({
    queryKey: allProjectsKey(),
    queryFn: getProjects,
  });

export const useProjectById = (id: string) =>
  useQuery({
    queryKey: projectKey(id),
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectRequest) => createProject(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectsKey() });
      qc.invalidateQueries({ queryKey: allProjectsKey() });
    },
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectRequest }) => 
        updateProject(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: projectsKey() });
      qc.invalidateQueries({ queryKey: allProjectsKey() });
      qc.invalidateQueries({ queryKey: projectKey(id) });
    },
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectsKey() });
      qc.invalidateQueries({ queryKey: allProjectsKey() });
    },
  });
};