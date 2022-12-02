import { WithId } from 'mongodb';
import zod from 'zod';

import { db } from '../../db';

export const Tags = zod.object(
    {
        tags: zod.array(zod.string())
    }    
);


export type Tags = zod.infer<typeof Tags>;

