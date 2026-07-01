import { IDataAudit } from "./IDataAudit";

export interface WGBlog extends IDataAudit{
    id?: number;
    image: string;
    title: string;
    description: string;
    content: string;
    views: number;
    tags: string; 
    status: string; 
    priority: string; 
    wGBlogCategoryId: number;
}
export interface WGBlogCategory extends IDataAudit{
    id?: number;
    name: string;
}
