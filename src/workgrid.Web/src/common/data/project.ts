import { Priority } from "common/enums/Priority";
import { ProjectStatus } from "common/enums/ProjectStatus";

export interface ProjectMemberDto {
    userId: string;
    fullName: string;
    profilePictureUrl?: string | null;
}

export interface ProjectDto {
    id: string;
    name: string;
    description?: string | null;
    status: ProjectStatus;   
    priority: Priority;      
    members: ProjectMemberDto[];  
    cardCounts: number;
}

export interface CreateProjectRequest {
    name: string;
    description?: string | null;
    status: ProjectStatus;     
    priority: Priority;        
    memberUserIds: string[];
}

export interface UpdateProjectRequest {
    name: string;
    description?: string | null;
    status: ProjectStatus;    
    priority: Priority;       
    memberUserIds: string[];
}