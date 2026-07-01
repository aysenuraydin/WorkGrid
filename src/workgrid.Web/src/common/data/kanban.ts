import { KanbanStatus } from "common/enums/KanbanStatus";
import { Priority } from "common/enums/Priority";

export interface CardMember {
  userId: string;
  fullName?: string | null;
  profilePictureUrl?: string | null;
}

export interface KanbanCardDto {
  id: string;
  title: string;
  text?: string | null;
  pictureUrl?: string | null;
  progressPercent?: number | null;
  views: number;       
  comments: number;    
  attachments: number; 
  dueDate?: string | null;
  order: number;
  projectId: string;
  status: KanbanStatus;
  priority: Priority;   
  badges: string[];
  members: CardMember[];
}

export interface KanbanBoardDto {
  statusName: string;
  statusValue: KanbanStatus;  
  cards: KanbanCardDto[];
}

export interface CreateCardPayload {
  projectId: string;
  title: string;
  text?: string;
  pictureUrl?: string;
  progressPercent?: number;
  dueDate?: string;
  status?: KanbanStatus;
  priority?: Priority;
  badges: string[];
  memberUserIds: string[]; 
}

export interface UpdateCardPayload extends Omit<CreateCardPayload, "projectId"> {}

export interface MoveCardPayload {
  targetStatus: KanbanStatus;
  newOrder: number;
}

export interface KanbanColumn {
  id:         string;
  name:       string;
  color:      string;
  order:      number;
  badgeCount: number;
  cards:      KanbanCardDto[];
}

export interface CreateColumnPayload {
  name:  string;
  color: string;
}