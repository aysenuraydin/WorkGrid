import { CalendarEvent } from "common/data/CalendarEvent";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export const formatDateTag = (date: Date): string => {
    const d = new Date(date);
    const month = MONTH_NAMES[d.getMonth()];
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
};

export const formatTimeTag = (date: Date | string): string => {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const getEventDateTag = (event: CalendarEvent | null): string => {
    if (!event?.start) return "";
    const start = formatDateTag(new Date(event.start));
    if (!event.end) return start;
    return `${start} to ${formatDateTag(new Date(event.end))}`;
};

export const getEventStartTimeTag = (event: CalendarEvent | null): string => {
    if (!event?.start) return "12:00 AM";
    return formatTimeTag(event.start);
};

export const getEventEndTimeTag = (event: CalendarEvent | null): string => {
    if (!event?.end) return "";
    return formatTimeTag(event.end);
};

export const extractTimeString = (date: Date | string | undefined): string => {
    if (!date) return "";
    return new Date(date).toTimeString().slice(0, 5);
};

export const buildDateWithTime = (date: Date, timeString: string): Date => {
    const result = new Date(date);
    if (!timeString) return result;
    const [h, m] = timeString.split(":");
    result.setHours(parseInt(h, 10), parseInt(m, 10), 0);
    return result;
};