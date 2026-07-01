export interface CalendarEvent {
    id: string;
    title: string;
    start: Date | string;
    end?: Date | string;
    className: string;
    location?: string;
    description?: string;
    projectId?: string;

    isPublic: boolean; 
    userId: string;
}

export interface CreateOrUpdateEventDto {
    title: string;
    start: Date;
    end: Date;
    className: string;
    location?: string;
    description?: string;
    isPublic: boolean;
}

export interface DragDropMoveDto {
    start: Date;
    end: Date;
}

export interface EventFormValues {
    title: string;
    category: string;
    location: string;
    description: string;
    defaultDate: Date[];
    startTime: string;
    endTime: string;
    isPublic: boolean;
}

export interface CalendarCategory {
    id: number;
    title: string;
    type: "success" | "info" | "warning" | "danger" | "primary" | "secondary" | "dark";
    className: string;
}

export interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    isReadOnly: boolean;
    selectedEvent: CalendarEvent | null;
    onSwitchToEdit: () => void;
    onDeleteClick: () => void;
    validation: any;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export interface CategoryPanelProps {
    categories: CalendarCategory[];
    onDrag: (e: React.DragEvent) => void;
    onCreateClick: () => void;
}

export interface UpcomingEventsPanelProps {
    events: CalendarEvent[];
    isLoading: boolean;
}