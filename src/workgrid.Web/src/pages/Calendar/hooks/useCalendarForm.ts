import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CalendarEvent, EventFormValues } from "../../../common/data/CalendarEvent";
import { useCreateEvent, useUpdateEvent } from "hooks/useCalendar";
import { useAuth } from "context/AuthContext";
import { useUserProfile } from "hooks/useUser";
import { buildDateWithTime, extractTimeString } from "common/utils/calendarUtils";

interface UseCalendarFormOptions {
    selectedEvent: CalendarEvent | null;
    isEdit: boolean;
    onSuccess: () => void;
}

export const useCalendarForm = ({
    selectedEvent,
    isEdit,
    onSuccess,
}: UseCalendarFormOptions) => {
    const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
    const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
    const { user: usr } = useAuth(); 
    const { data: user, isLoading:isUserLoading } = useUserProfile(usr?.id ?? "");

    const validation = useFormik<EventFormValues>({
        enableReinitialize: true,
        initialValues: {
            title: selectedEvent?.title ?? "",
            category: selectedEvent?.className ?? "bg-primary-subtle",
            location: selectedEvent?.location ?? "",
            description: selectedEvent?.description ?? "",
            defaultDate: selectedEvent?.start
                    ? [
                        new Date(selectedEvent.start),
                        selectedEvent.end
                            ? new Date(selectedEvent.end)
                            : new Date(selectedEvent.start),
                    ]
                    : [],
            startTime: extractTimeString(selectedEvent?.start),
            endTime: extractTimeString(selectedEvent?.end), 
            isPublic: selectedEvent?.isPublic ?? false, 
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Please enter event name"),
            category: Yup.string().required("Please select a category"),
            location: Yup.string().required("Please enter a location"),
            description: Yup.string().required("Please enter a description"),
            defaultDate: Yup.array()
                .of(Yup.date())
                .min(1, "Please select a date range")
                .required("Date is required"),
            startTime: Yup.string().required("Start time is required"),
            endTime: Yup.string().required("End time is required"),
        }),
        onSubmit: (values, { resetForm }) => {
            const dates = values.defaultDate;
            const startDate = buildDateWithTime(new Date(dates[0]), values.startTime);
            const endDate = buildDateWithTime(
                dates[1] ? new Date(dates[1]) : new Date(dates[0]),
                values.endTime
            );

            const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("WG");

            const dto = {
                title: values.title,
                className: values.category,
                start: startDate,
                end: endDate,
                location: values.location,
                description: values.description, 
                isPublic: isAdmin ? values.isPublic : false,
            };

            if (isEdit && selectedEvent?.id) {
                updateEvent(
                    { id: selectedEvent.id, dto },
                    {
                        onSuccess: () => {
                            toast.success("Event updated successfully.");
                            resetForm();
                            onSuccess();
                        },
                        onError: () => {
                            toast.error("Failed to update event.");
                        },
                    }
                );
            } else {
                createEvent(dto, {
                    onSuccess: () => {
                        toast.success("New event added successfully.");
                        resetForm();
                        onSuccess();
                    },
                    onError: () => {
                        toast.error("Failed to create event.");
                    },
                });
            }
        },
    });

    return { validation, isCreating, isUpdating };
};