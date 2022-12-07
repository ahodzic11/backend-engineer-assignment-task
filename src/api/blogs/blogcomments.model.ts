import { WithId } from 'mongodb';
import zod from 'zod';
import { SingleCommentData, MultipleComments } from './comment.model'
import { db } from '../../db';

export const BlogComment = zod.object(
    {
        blogSlug: zod.string().min(1),
        comments: zod.array(SingleCommentData)
    }    
);

export type BlogComment = zod.infer<typeof BlogComment>;
export type BlogCommentsWithId = WithId<BlogComment>;
export const BlogCommentsDB = db.collection<BlogComment>('comments');