import { toast } from "react-toastify";
import { FormikProps } from "formik";
import { CalendarEvent, EventFormValues } from "../../../common/data/CalendarEvent";
import { useCalendarContext } from "context/CalendarContext";
import { useCreateEvent, useDeleteEvent, useMoveEvent } from "hooks/useCalendar";

interface UseCalendarHandlersOptions {
    validation: FormikProps<EventFormValues>;
}

export const useCalendarHandlers = ({ validation }: UseCalendarHandlersOptions) => {
    const { openModal, closeModal, closeDeleteModal, selectedEvent } = useCalendarContext();
    const { mutate: moveEvent } = useMoveEvent();
    const { mutate: createEvent } = useCreateEvent();
    const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();

    const handleDateClick = (arg: any) => {
        validation.resetForm();
        validation.setFieldValue("defaultDate", [arg.date]);
        openModal();
    };

    const handleEventClick = (arg: any) => {
        console.log("Event clicked:", arg.event);
        const ev = arg.event;
        
        const eventData: CalendarEvent = {
            id: ev.id,
            title: ev.title,
            start: ev.start,
            end: ev.end,
            className: ev.classNames[0] ?? "bg-primary-subtle",
            location: ev._def.extendedProps.location ?? "",
            description: ev._def.extendedProps.description ?? "",
            isPublic: ev._def.extendedProps.isPublic ?? false,
            userId: ev._def.extendedProps.userId ?? "",
        };
        openModal(eventData, true);
    };

    const handleEventDrop = (info: any) => {
        moveEvent(
            {
                id: info.event.id,
                start: info.event.start,
                end: info.event.end ?? info.event.start,
            },
            {
                onSuccess: () => toast.success("Event date updated."),
                onError: () => {
                    info.revert();
                    toast.error("Failed to update event date.");
                },
            }
        );
    };

    const handleExternalDrop = (info: any) => {
        const draggedEl = info.draggedEl;
        if (!draggedEl.classList.contains("external-event")) return;

        const dto = {
            title: draggedEl.innerText.trim(),
            className: draggedEl.className
                .split(" ")
                .filter((c: string) => c.startsWith("bg-"))
                .join(" "),
            start: info.date,
            end: info.date,
            location: "",
            description: "",
            isPublic: false,  
        };

        createEvent(dto, {
            onSuccess: () => toast.success("Event added from category."),
            onError: () => toast.error("Failed to add event."),
        });
    };

    const handleDeleteEvent = () => {
        if (!selectedEvent?.id) return;
        deleteEvent(selectedEvent.id, {
            onSuccess: () => {
                toast.success("Event deleted.");
                closeDeleteModal();
                closeModal();
            },
            onError: () => {
                toast.error("Failed to delete event.");
            },
        });
    };

    const handleDragCategory = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return {
        handleDateClick,
        handleEventClick,
        handleEventDrop,
        handleExternalDrop,
        handleDeleteEvent,
        handleDragCategory,
        isDeleting,
    };
};