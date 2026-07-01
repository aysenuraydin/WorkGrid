export enum CommentItemType {
  Blog = 0,
  Product = 1,
  Task = 2,
  User = 3,
}

export interface CreateCommentDto {
  itemId: string;
  itemType: CommentItemType;
  content: string;
  rating?: number | null;
  parentId?: number | null;
  images?: string | null;   
}

export interface UpdateCommentDto {
  content: string;
  rating?: number | null;
  images?: string | null;
}

export interface Comment {
  id: number;
  itemId: string;
  itemType: CommentItemType;
  userId: string;
  content: string;
  rating?: number | null;
  parentId?: number | null;
  createdAt: string;
  authorName?: string | null;
  authorAvatarUrl?: string | null;
  images: string[];     
  replies?: Comment[];   
}