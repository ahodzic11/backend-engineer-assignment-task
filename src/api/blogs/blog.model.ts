import { WithId } from 'mongodb';
import zod from 'zod';
import { Comment, SingleCommentData,  } from './comment.model'
import { db } from '../../db';




export const BlogData = zod.object(
    {
        slug: zod.string().min(1),
        title: zod.string().min(1),
        description: zod.string().min(1),
        body: zod.string().min(1),
        tagList: zod.array(zod.string()),
        createdAt: zod.string().min(1),
        updatedAt: zod.string().min(1)
    }    
);

export const Blog = zod.object(
    {
        blogPost: BlogData
    }    
);

export const MultipleBlogPosts = zod.object(
    {
        blogPosts: zod.array(BlogData)
    }
)

export type Blog = zod.infer<typeof Blog>;
export type MultipleBlogPosts = zod.infer<typeof MultipleBlogPosts>;
export type BlogWithId = WithId<Blog>;
export const Blogs = db.collection<Blog>('blogs');