import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, deleteComment, getCommentsByItem, getCommentsForAdmin, getCommentsRaitingByItem, getCommentsRaitingByItems, updateComment } from "helpers/backend_helper";

export const commentsKey = (itemType: string, itemId: string) => ["comments", itemType, itemId] as const;

export const useComments = (itemType: string, itemId: string) =>
    useQuery({
    queryKey: commentsKey(itemType, itemId),
    queryFn: () => getCommentsByItem(itemType, itemId),
    enabled: !!itemType && !!itemId, 
});

export const useCommentsRaitingAverages = (itemType: string, itemIds: string[]) =>
    useQuery<Record<string, number>>({
        queryKey: ["comment", "rating-averages", itemType, [...itemIds].sort().join(",")],
        queryFn: () => getCommentsRaitingByItems(itemType, itemIds),
        enabled: !!itemType && itemIds.length > 0,
    });
export const useCommentsRaiting = (itemType: string, itemId: string) =>
    useQuery({
        queryKey: ["comment", "rating-average", itemType, itemId],
        queryFn: () => getCommentsRaitingByItem(itemType, itemId),
        enabled: !!itemType && !!itemId,
    });
export const adminCommentsKey = (itemType: string) =>
    ["adminComments", String(itemType)] as const;
 
export const useAdminComments = (itemType: string) =>
    useQuery({
        queryKey: adminCommentsKey(itemType ?? -99),
        queryFn: () => getCommentsForAdmin(itemType!),
        enabled: itemType !== null,
    });
 

export const useCreateComment = (itemType: string, itemId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => createComment(payload),
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: commentsKey(itemType, itemId) });
        },
    });
};

export const useUpdateComment = (itemType: string, itemId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, payload }: { commentId: number | string; payload: any }) => 
            updateComment(commentId, payload),
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: commentsKey(itemType, itemId) });
        },
    });
};

// ── DELETE: Yorum sil ──
export const useDeleteComment = (itemType: string, itemId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (commentId: number | string) => 
            deleteComment(commentId),
        onSuccess: () => {
        qc.invalidateQueries({ queryKey: commentsKey(itemType, itemId) });
        qc.invalidateQueries({ queryKey: adminCommentsKey(itemType) });
        },
    });
};