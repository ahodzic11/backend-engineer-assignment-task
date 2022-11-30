import { ObjectId } from 'mongodb';
import * as z from 'zod';

export const ParamsWithSlug = z.object({
    slug: z.string().min(1).refine((val) => {
        try{
            return new ObjectId(val);
        }catch (error) {
            return false;
        }
    },{
        message: 'Invalid ObjectId',
    }),
});

export type ParamsWithSlug = z.infer<typeof ParamsWithSlug>