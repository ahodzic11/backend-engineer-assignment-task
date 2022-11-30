import { Response, Request } from 'express';
import { Blogs, BlogWithId } from './blogs.model';

export async function findAll(req: Request, res: Response<BlogWithId[]>){
    const result = await Blogs.find();
    const blogs = await result.toArray()
    res.json(blogs);
}