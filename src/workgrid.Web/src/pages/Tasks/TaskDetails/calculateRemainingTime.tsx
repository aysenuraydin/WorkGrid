interface TimeTrackingResult {
    isExpired: boolean;
    formattedDate: string;
    remainingText: string;
    hasValue: boolean;
}

export const calculateRemainingTime = (dueDateString: string | null | undefined): TimeTrackingResult => {
    if (!dueDateString) {
        return { isExpired: false, formattedDate: "—", remainingText: "—", hasValue: false };
    }

    const dueDate = new Date(dueDateString);
    const now = new Date();
    const difference = dueDate.getTime() - now.getTime();
    const isExpired = difference <= 0;

    const formattedDate = dueDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    if (isExpired) {
        return { isExpired: true, formattedDate, remainingText: "00:00:00", hasValue: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    const remainingText = `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m`;

    return { isExpired: false, formattedDate, remainingText, hasValue: true };
};
