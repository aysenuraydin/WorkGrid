import { KanbanStatus } from "common/enums/KanbanStatus";

export const STATUS_INDEX_MAP: Record<number, KanbanStatus> = {
  1: KanbanStatus.New,
  2: KanbanStatus.Pending,
  3: KanbanStatus.InProgress,
  4: KanbanStatus.Review,
  5: KanbanStatus.Completed
};