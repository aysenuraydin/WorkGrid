import { ProjectStatus } from "common/enums/ProjectStatus";

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; bg: string; color: string; icon: string }> = {
  [ProjectStatus.Planning]:   { label: "Planlama",    bg: "#E2E8F0", color: "#475569", icon: "ri-ball-pen-line" },    
  [ProjectStatus.New]:        { label: "Yeni",        bg: "#E0F2FE", color: "#0369A1", icon: "ri-sparkling-2-line" }, 
  [ProjectStatus.Pending]:    { label: "Beklemede",   bg: "#FCE7F3", color: "#B7094C", icon: "ri-time-line" },        
  [ProjectStatus.InProgress]: { label: "Aktif İş",    bg: "#FFEDD5", color: "#C2410C", icon: "ri-git-merge-line" },  
  [ProjectStatus.Review]:     { label: "İncelemede",  bg: "#E0E7FF", color: "#4338CA", icon: "ri-search-eye-line" },  
  [ProjectStatus.OnHold]:     { label: "Durduruldu",  bg: "#F3E8FF", color: "#6B21A8", icon: "ri-pause-circle-line" }, 
  [ProjectStatus.Completed]:  { label: "Tamamlandı",  bg: "#DCFCE7", color: "#15803D", icon: "ri-checkbox-circle-line"}, 
  [ProjectStatus.Cancelled]:  { label: "İptal Edildi",bg: "#FEE2E2", color: "#B91C1C", icon: "ri-close-circle-line" },  
  [ProjectStatus.Archived]:   { label: "Arşivlendi",  bg: "#F1F5F9", color: "#94A3B8", icon: "ri-archive-line" },
};
