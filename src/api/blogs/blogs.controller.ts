import { Response, Request, NextFunction } from 'express';
import { InsertOneResult, ObjectId } from 'mongodb';
import { ZodError } from 'zod';
import { Blog, Blogs, BlogWithId } from './blog.model';
import slugify from 'limax';
import { ParamsWithSlug } from '../../interfaces/ParamsWithSlug';

export async function findAll(req: Request, res: Response<BlogWithId[]>, next: NextFunction){
    try{
        const result = await Blogs.find();
        const blogs = await result.toArray()
        res.json(blogs);
    }catch(error){
        next(error)
    }
}

export async function listBlogPosts(req: Request, res: Response<BlogWithId[]>, next: NextFunction){
    try{
        const result = await Blogs.find();
        let blogs = await result.toArray()
        const sortedBlogs = blogs.sort(
            (objA, objB) => new Date(objA.blogPost.createdAt).getTime() - new Date(objB.blogPost.createdAt).getTime()
        );
        res.json(sortedBlogs)
    }catch(error){
        next(error)
    }
}

export async function findBlog(req: Request<ParamsWithSlug, BlogWithId, {}>, res: Response<BlogWithId>, next: NextFunction){
    try{
        const result = await Blogs.findOne({
            "blogPost.slug": req.params.slug,
        });
        if(!result){
            res.status(404);
            throw new Error(`Blog with id "${req.params.slug}" not found.`);
        }
        res.json(result);
    }catch (error) {
        next(error);
    }
}

export async function createBlog(req: Request<{}, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
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

export async function updateBlog(req: Request<ParamsWithSlug, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
    try{
        const result = await Blogs.findOneAndUpdate({
            "blogPost.slug": req.params.slug,
        },{
            $set: req.body,
        }, {
            returnDocument: 'after',
        });
        if(!result.value){
            res.status(404);
            console.log(req.params.slug)
            throw new Error(`Blog with id "${req.params.slug}" not found.`);
        }
        res.json(result.value);
    }catch(error){
        next(error);
    }
}

export async function deleteBlog(req: Request<ParamsWithSlug, {}, {}>, res: Response<{}>, next:NextFunction){
    try{
        const result = await Blogs.findOneAndDelete({
            "blogPost.slug": req.params.slug,
        });
        if(!result.value){
            res.status(404);
            throw new Error(`Blog with id "${req.params.slug}" not found.`)
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
