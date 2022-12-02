import { Response, Request, NextFunction } from 'express';
import { Blogs } from './blog.model';
import { Tags } from './tags.model';

export async function getTags(req: Request, res: Response<Tags>, next: NextFunction){
    try{
        const result = await Blogs.find();
        const blogs = await result.toArray()
        let tagList: Tags = {
            tags: []
        }
        blogs.forEach(element => {
            element.blogPost.tagList.forEach(tag => {
                if(!tagList.tags.includes(tag))
                    tagList.tags.push(tag)
            })
        });
        res.json(tagList);
    }catch(error){
        next(error)
    }
}