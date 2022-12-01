import { Response, Request, NextFunction } from 'express';
import { Blogs } from './blog.model';

export async function getTags(req: Request, res: Response<String[]>, next: NextFunction){
    try{
        const result = await Blogs.find();
        const blogs = await result.toArray()
        let allTags: String[] = []
        blogs.forEach(element => {
            element.blogPost.tagList.forEach(tag => {
                if(!allTags.includes(tag))
                    allTags.push(tag)
            })
        });
        res.json(allTags);
    }catch(error){
        next(error)
    }
}