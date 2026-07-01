import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getCalendarEvents, 
    createCalendarEvent, 
    updateCalendarEvent, 
    moveCalendarEvent, 
    deleteCalendarEvent 
} from "helpers/backend_helper";

export const CALENDAR_QUERY_KEY = ["calendarEvents"] as const;
const getCalendarKey = (projectId?: string) => projectId ? [...CALENDAR_QUERY_KEY, projectId] : CALENDAR_QUERY_KEY;

export const useCalendarEvents = (projectId?: string) =>
    useQuery({
        queryKey: getCalendarKey(projectId),
        queryFn: () => getCalendarEvents(projectId),
        staleTime: 1000 * 60 * 5,  
        gcTime: 1000 * 60 * 10,  
        refetchOnWindowFocus: false,  
        placeholderData: (previousData) => previousData, 
    });

export const useCreateEvent = (projectId?: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createCalendarEvent,
        onSuccess: () => qc.invalidateQueries({ queryKey: getCalendarKey(projectId) }),
    });
};

export const useUpdateEvent = (projectId?: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string, dto: any }) => updateCalendarEvent(id, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: getCalendarKey(projectId) }),
    });
};

export const useMoveEvent = (projectId?: string) => {
    const qc = useQueryClient();
    const queryKey = getCalendarKey(projectId);

    return useMutation({
        mutationFn: ({ id, start, end }: { id: string; start: Date; end: Date }) => 
            moveCalendarEvent(id, start, end),
        
        onMutate: async ({ id, start, end }) => {
            await qc.cancelQueries({ queryKey });
            const previous = qc.getQueryData(queryKey);
            qc.setQueryData(queryKey, (old: any[] = []) =>
                old.map((e) => (e.id === id ? { ...e, start, end } : e))
            );
            return { previous };
        },
        onError: (_err, _vars, ctx: any) => qc.setQueryData(queryKey, ctx.previous),
        onSettled: () => qc.invalidateQueries({ queryKey }),
    });
};

export const useDeleteEvent = (projectId?: string) => {
    const qc = useQueryClient();
    const queryKey = getCalendarKey(projectId);

    return useMutation({
        mutationFn: (id: string) => deleteCalendarEvent(id),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey });
            const previous = qc.getQueryData(queryKey);
            qc.setQueryData(queryKey, (old: any[] = []) => old.filter((e) => e.id !== id));
            return { previous };
        },
        onError: (_err, _vars, ctx: any) => qc.setQueryData(queryKey, ctx.previous),
        onSettled: () => qc.invalidateQueries({ queryKey }),
    });
};