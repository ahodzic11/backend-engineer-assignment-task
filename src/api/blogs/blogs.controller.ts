import { Response, Request, NextFunction } from 'express';
import { InsertOneResult } from 'mongodb';
import { ZodError } from 'zod';
import { Blog, Blogs, BlogWithId } from './blog.model';
import slugify from 'limax';

export async function findAll(req: Request, res: Response<BlogWithId[]>, next: NextFunction){
    try{
        const result = await Blogs.find();
        const blogs = await result.toArray()
        res.json(blogs);
    }catch(error){
        next(error)
    }
}

export async function createPost(req: Request<{}, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
    try{
        const newBlog: Blog = {
            blogPost: {
                slug: slugify(req.body.blogPost.title),
                title: req.body.blogPost.title,
                description: req.body.blogPost.description,
                body: req.body.blogPost.body,
                tagList: req.body.blogPost.tagList,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),}
            
        }
        const insertResult = await Blogs.insertOne(newBlog);
        if(!insertResult.acknowledged) throw new Error(`Error inserting a new blog.`);
        res.status(201);
        res.json({
            _id: insertResult.insertedId,
            ...newBlog,
        })
    }catch(error){
        next(error)
    }
}

export async function updateOne(req: Request<, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
    try{
        const result = await
    }
}


