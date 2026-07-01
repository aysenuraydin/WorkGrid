import { Priority } from "common/enums/Priority";

export const PRIORITY_STATUS_META: Record<Priority, { label: string; color: string }> = {
  [Priority.High]:   { label: "High",   color: "danger"  },
  [Priority.Medium]: { label: "Medium", color: "warning" },
  [Priority.Low]:    { label: "Low",    color: "success" },
};