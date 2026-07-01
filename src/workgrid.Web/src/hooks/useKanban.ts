import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    getKanbanBoard, getKanbanCard, createKanbanCard, updateKanbanCard, createKanbanColumn,
    deleteKanbanCard, moveKanbanCard, 
} from "helpers/backend_helper";
import { CreateCardPayload, CreateColumnPayload, KanbanBoardDto, MoveCardPayload, UpdateCardPayload } from "common/data/kanban";

export const boardKey = (projectId: string) => ["kanban", "board", projectId] as const;

export const useBoard = (projectId: string | null) =>
    useQuery({
        queryKey: boardKey(projectId ?? ""),
        queryFn: () => getKanbanBoard(projectId!),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5,  
        gcTime: 1000 * 60 * 10,  
        refetchOnWindowFocus: false,  
        placeholderData: (previousData) => previousData, 
    });

export const useCard = (cardId: string | null) =>
    useQuery({
        queryKey: ["kanban", "card", cardId],
        queryFn: () => getKanbanCard(cardId!),
        enabled: !!cardId,
    });

export const useCreateColumn = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateColumnPayload) => createKanbanColumn(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: boardKey(projectId) }),
    });
};

export const useCreateCard = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCardPayload) => createKanbanCard(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: boardKey(projectId) }),
    });
};

export interface UpdateCardArgs {
    id: string;
    payload: UpdateCardPayload;
}

export const useUpdateCard = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: UpdateCardArgs) => updateKanbanCard(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: boardKey(projectId) }),
    });
};

export const useDeleteCard = (projectId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteKanbanCard(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: boardKey(projectId) }),
    });
};

export interface MoveCardArgs {
    id: string;
    payload: MoveCardPayload;
}

export const useMoveCard = (projectId: string) => {
    const qc = useQueryClient();
    const key = boardKey(projectId);

    return useMutation({
        mutationFn: ({ id, payload }: MoveCardArgs) => moveKanbanCard(id, payload),
        
        onMutate: async ({ id, payload }: MoveCardArgs) => {
            await qc.cancelQueries({ queryKey: key });
            const previous = qc.getQueryData<KanbanBoardDto[]>(key);

            qc.setQueryData<KanbanBoardDto[]>(key, old => {
                if (!old) return old;
                
                const card = old.flatMap(col => col.cards).find(c => c.id === id);
                if (!card) return old;

                return old.map(col => {
                    const filtered = col.cards.filter(c => c.id !== id);
                    const isTargetColumn = col.statusValue === payload.targetStatus || String(col.statusValue) === String(payload.targetStatus);

                    if (isTargetColumn) {
                        const inserted = [...filtered];
                        inserted.splice(payload.newOrder, 0, { ...card, status: payload.targetStatus });
                        return { ...col, cards: inserted };
                    }
                    return { ...col, cards: filtered };
                });
            });
            return { previous };
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.previous) qc.setQueryData(key, ctx.previous);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: key }),
    });
};