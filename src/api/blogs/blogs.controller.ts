import { Response, Request, NextFunction } from 'express';
import { Blog, Blogs, BlogWithId,  MultipleBlogPosts } from './blog.model';
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

export async function listBlogPosts(req: Request, res: Response<MultipleBlogPosts>, next: NextFunction){
    try{
        const tag = req.query.tag as string;
        const result = await Blogs.find();
        let blogs = await result.toArray();

        let multipleBlogPosts: MultipleBlogPosts = {
            blogPosts: [],
            postsCount: blogs.length
        }

        let filteredBlogs: BlogWithId[] = []
        if(req.query.tag){
            
            blogs.forEach(blog => {
            if(blog.blogPost.tagList.includes(tag))
                filteredBlogs.push(blog)
            });
        }else{
            filteredBlogs = blogs
        }
        

        let sortedBlogs = filteredBlogs.sort(
            (objA, objB) => new Date(objA.blogPost.createdAt).getTime() - new Date(objB.blogPost.createdAt).getTime()
        );
        
        sortedBlogs.forEach(blog => {
            multipleBlogPosts.blogPosts.push(blog.blogPost)
        })
        
        multipleBlogPosts.postsCount=sortedBlogs.length

        console.log(tag)
        res.json(multipleBlogPosts)
    }catch(error){
        next(error)
    }
}

export async function createBlog(req: Request<{}, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
    try{
        // Checking to see whether a blog with the same slug already exists in the database
        const alreadyExistingBLog = await Blogs.findOne({
            "blogPost.slug": slugify(req.body.blogPost.title),
        });
        if(alreadyExistingBLog){
            res.status(404);
            throw new Error(`Blog with slug "${slugify(req.body.blogPost.title)}" already exists.`);
        }

        let tagList: string[] = []
        if(req.body.blogPost.tagList)
            tagList = req.body.blogPost.tagList
        const newBlog: Blog = {
            blogPost: {
                slug: slugify(req.body.blogPost.title),
                title: req.body.blogPost.title,
                description: req.body.blogPost.description,
                body: req.body.blogPost.body,
                tagList: tagList,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
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
        let newTitle: String = ""
        let newDescription: String = ""
        let newBody: String = ""
        if(req.body.blogPost.title){
            newTitle = req.body.blogPost.title
        }
       // console.log(req.body.blogPost.)
        /*const updatedBlog: Blog = {
            blogPost: {
                slug: ""
            }
        }
*/
        const previousBlog = await Blogs.findOne({"blogPost.slug" : req.params.slug})

        if(!previousBlog){
            res.status(404);
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }

        const result = await Blogs.findOneAndUpdate({
            "blogPost.slug": req.params.slug,
        },{
            $set: {
                "blogPost.title" : req.body.blogPost.title,
                "blogPost.description": req.body.blogPost.description,
                "blogPost.body": req.body.blogPost.body,
                "blogPost.slug": slugify(req.body.blogPost.title)
        },
        }, {
            returnDocument: 'after',
        });
        
        if(!result.value){
            res.status(404);
            console.log(req.params.slug)
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
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
