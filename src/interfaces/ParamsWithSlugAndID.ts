import { ObjectId } from 'mongodb';
import * as z from 'zod';

export const ParamsWithSlugAndID = z.object({
    slug: z.string().min(1).refine((val) => {
        try{
            return new ObjectId(val);
        }catch (error) {
            return false;
        }
    },{
        message: 'Invalid ObjectId',
    }),
    id: z.number()
});

export type ParamsWithSlugAndID = z.infer<typeof ParamsWithSlugAndID>