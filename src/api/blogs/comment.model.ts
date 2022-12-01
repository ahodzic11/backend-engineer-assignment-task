import { WithId } from 'mongodb';
import zod from 'zod';

import { db } from '../../db';

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


export type Comment = zod.infer<typeof Comment>;
export type CommentRequestBody = zod.infer<typeof CommentRequestBody>;
