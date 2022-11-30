import { WithId } from 'mongodb';
import zod from 'zod';

import { db } from '../../db';

const Blog = zod.object(
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

export type Blog = zod.infer<typeof Blog>;
export type BlogWithId = WithId<Blog>;
export const Blogs = db.collection<Blog>('blogs');