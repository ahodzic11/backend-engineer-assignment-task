import zod from 'zod';

export const Tags = zod.object(
    {
        tags: zod.array(zod.string())
    }    
);


export type Tags = zod.infer<typeof Tags>;

