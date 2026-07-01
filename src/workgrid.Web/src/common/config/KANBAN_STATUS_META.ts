import { KanbanStatus } from "common/enums/KanbanStatus";

export const KANBAN_STATUS_META: Record<
  KanbanStatus, 
  { label: string; color: string; bgClass: string; hexBg: string; hexText: string; icon: string }
> = {
  [KanbanStatus.New]: { 
    label: "Yeni",         
    color: "success",   
    bgClass: "bg-success-subtle text-success", 
    hexBg: "#F0FDF4", 
    hexText: "#2B7A4B",
    icon: "ri-add-circle-line"  
  },
  [KanbanStatus.Pending]: { 
    label: "Beklemede",     
    color: "secondary", 
    bgClass: "bg-secondary-subtle text-secondary", 
    hexBg: "#F8FAFC",  
    hexText: "#57606A",
    icon: "ri-time-line" 
  },
  [KanbanStatus.InProgress]: { 
    label: "Devam Ediyor",  
    color: "warning",   
    bgClass: "bg-warning-subtle text-warning", 
    hexBg: "#FFF7ED",  
    hexText: "#B25E29",
    icon: "ri-loader-4-line"  
  },
  [KanbanStatus.Review]: { 
    label: "İncelemede",   
    color: "info",      
    bgClass: "bg-info-subtle text-info", 
    hexBg: "#F0F9FF", 
    hexText: "#2C6E91",
    icon: "ri-eye-line" 
  },
  [KanbanStatus.Completed]: { 
    label: "Tamamlandı",   
    color: "success",   
    bgClass: "bg-success-subtle text-success", 
    hexBg: "#ECFDF5", 
    hexText: "#237A5B",
    icon: "ri-checkbox-circle-line" 
  },
};