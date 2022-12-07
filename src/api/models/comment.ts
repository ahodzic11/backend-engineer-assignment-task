import { WithId } from 'mongodb';
import zod from 'zod';

export const SingleCommentData = zod.object(
    {
        id: zod.number(),
        createdAt: zod.string().min(1),
        updatedAt: zod.string().min(1),
        body: zod.string().min(1)
    }    
);

export const Comment = zod.object(
    {
        comment: SingleCommentData
    }    
);

export const CommentRequestBodyData = zod.object(
    {
        body: zod.string().min(1)
    }    
);

export const CommentRequestBody = zod.object(
    {
        comment: CommentRequestBodyData
    }    
);

export const MultipleComments = zod.object(
    {
        comments: zod.array(SingleCommentData)
    }    
);


export type Comment = zod.infer<typeof Comment>;
export type CommentRequestBody = zod.infer<typeof CommentRequestBody>;
export type SingleCommentData = zod.infer<typeof SingleCommentData>;
export type MultipleComments = zod.infer<typeof MultipleComments>;
export type CommentWithId = WithId<Comment>;