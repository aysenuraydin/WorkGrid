import React, { createContext, useContext } from "react";
import { useAuth } from "context/AuthContext";
import { useComments, useCreateComment, useDeleteComment, useUpdateComment } from "hooks/useComment";
import { Comment, CommentItemType } from "common/data/comment";
import { buildCommentTree } from "helpers/comment.helper";

interface CommentContextValue {
  itemType: CommentItemType;
  itemId: string;
  isRating: boolean;        
  tree: Comment[];          
  flat: Comment[];          
  isLoading: boolean;
  currentUserId?: string;
  isAdmin: boolean;
  create: ReturnType<typeof useCreateComment>;
  update: ReturnType<typeof useUpdateComment>;
  remove: ReturnType<typeof useDeleteComment>;
}

const CommentContext = createContext<CommentContextValue | null>(null);

export const useCommentContext = () => {
  const ctx = useContext(CommentContext);
  if (!ctx) throw new Error("useCommentContext must be used within CommentProvider");
  return ctx;
};

interface ProviderProps {
  itemType: CommentItemType;
  itemId: string | number;
  isRating?: boolean;
  isUser?: boolean;
  children: React.ReactNode;
}

export const CommentProvider: React.FC<ProviderProps> = ({ itemType, itemId, isRating = false, children }) => {
  const typeStr = String(itemType);
  const idStr = String(itemId);

  const { user } = useAuth();
  const roles: string[] = (user as any)?.roles ?? [];
  const isAdmin = roles.includes("Admin") || roles.includes("WG");

  const { data: flat, isLoading } = useComments(typeStr, idStr);
  const create = useCreateComment(typeStr, idStr);
  const update = useUpdateComment(typeStr, idStr);
  const remove = useDeleteComment(typeStr, idStr);

  const tree = buildCommentTree(flat?.data as Comment[]);

  return (
    <CommentContext.Provider
      value={{
        itemType, itemId: idStr, isRating,
        tree, flat: flat?.data as Comment[], isLoading,
        currentUserId: user?.id,
        isAdmin,
        create, update, remove,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};