import { Response, Request, NextFunction } from 'express';
import { Blog, Blogs, BlogWithId,  MultipleBlogPosts } from '../models/blog';
import slugify from 'limax';
import { ParamsWithSlug } from '../../interfaces/ParamsWithSlug';
import { BlogCommentsDB } from '../models/blogcomments';

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - blogPost
 *       properties:
 *         blogPost:
 *           type: object
 *           required: 
 *             - slug
 *             - title
 *             - description
 *             - body
 *             - tagList
 *             - createdAt
 *             - updatedAt
 *           properties:
 *             slug:
 *               type: string
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             body:
 *               type: string
 *             tagList:
 *               type: array
 *               items:
 *                 type: string
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 */ 


// Returns all blog posts
export async function findAll(req: Request, res: Response<BlogWithId[]>, next: NextFunction){
    try{
        const result = await Blogs.find();
        const blogs = await result.toArray()
        res.json(blogs);
    }catch(error){
        next(error)
    }
}

/**
 * @swagger
 * /api/posts/{slug}:
 *   get:
 *     summary: Get blog post by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema: 
 *           type: string
 *         required: true
 *         description: The blog post slug
 *     responses:
 *       200:
 *         description: The blog post was found
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The blog post was not found
 */

// Returns a blog by slug
export async function findBlog(req: Request<ParamsWithSlug, BlogWithId, {}>, res: Response<BlogWithId>, next: NextFunction){
    try{
        const result = await Blogs.findOne({
            "blogPost.slug": req.params.slug,
        });
        if(!result){
            res.status(404);
            throw new Error(`Blog with slug ${req.params.slug} not found.`);
        }
        res.json(result);
    }catch (error) {
        next(error);
    }
}

/**
 * @swagger
 * tags:
 *   name: Blogs
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Returns the list of all the blog posts
 *     tags: [Blogs]
 *     responses:
 *       200: 
 *         description: The list of the blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: $ref:'#/components/schemas/Blog'
 */

// Returns a list of blogs sorted by date and time, filtered if a tag query parameter is present
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
        }else
            filteredBlogs = blogs
        

        let sortedBlogs = filteredBlogs.sort(
            (objA, objB) => new Date(objA.blogPost.createdAt).getTime() - new Date(objB.blogPost.createdAt).getTime()
        );
        
        sortedBlogs.forEach(blog => {
            multipleBlogPosts.blogPosts.push(blog.blogPost)
        })
        
        multipleBlogPosts.postsCount=sortedBlogs.length

        res.json(multipleBlogPosts)
    }catch(error){
        next(error)
    }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blogPost
 *             properties:
 *               blogPost: 
 *                 type: object
 *                 required: 
 *                   - title
 *                   - description
 *                   - body
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   body:
 *                     type: string
 *                   tagList:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: The blog post was successfully created
 *         contents:
 *           application/json:
 *             schema: $ref:'#/components/schemas/Blog'
 *       404:
 *         description: The blog post was not created
 */


// Creates and returns a new blog based on passed body request
export async function createBlog(req: Request<{}, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
    try{
        // Checking to see whether a blog with the same slug already exists in the database
        const alreadyExistingBlog = await Blogs.findOne({
            "blogPost.slug": slugify(req.body.blogPost.title),
        });
        if(alreadyExistingBlog){
            res.status(404);
            throw new Error(`Blog with slug "${slugify(req.body.blogPost.title)}" already exists.`);
        }

        // Setting taglist if it was passed as a parameter
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

/**
 * @swagger
 * /api/posts/{slug}:
 *   put:
 *     summary: Update a blog post by slug 
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog post slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blogPost
 *             properties:
 *               blogPost: 
 *                 type: object
 *                 required: 
 *                   - title
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   body:
 *                     type: string
 *     responses:
 *       200:
 *         description: The blog post was successfully updated
 *         contents:
 *           application/json:
 *             schema: $ref:'#/components/schemas/Blog'
 *       404:
 *         description: The blog post update failed
 */

// Updates blog post based on passed body request
export async function updateBlog(req: Request<ParamsWithSlug, BlogWithId, Blog>, res: Response<BlogWithId>, next: NextFunction){
    try{

        // Fetching previous blog data if it exists
        const previousBlog = await Blogs.findOne({"blogPost.slug" : req.params.slug})

        if(!previousBlog){
            res.status(404);
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }

        let newTitle: string = previousBlog?.blogPost.title
        let newBody: string = previousBlog?.blogPost.body
        let newDescription: string = previousBlog?.blogPost.description

        // Checking if certain fields were passed as parameters
        if(req.body.blogPost.body)
            newBody = req.body.blogPost.body
        if(req.body.blogPost.description)
            newDescription = req.body.blogPost.description
        if(req.body.blogPost.title)
            newTitle = req.body.blogPost.title

        // Updating fields 
        const result = await Blogs.findOneAndUpdate({
            "blogPost.slug": req.params.slug,
        },{
            $set: {
                "blogPost.slug": slugify(newTitle),
                "blogPost.title" : newTitle,
                "blogPost.description": newDescription,
                "blogPost.body": newBody,
                "blogPost.updatedAt": new Date().toISOString()
        },
        }, {
            returnDocument: 'after',
        });
        const updateBlogPostComment = await BlogCommentsDB.findOneAndUpdate({
            "blogSlug": req.params.slug,
        },{
            $set: {
                "blogSlug": slugify(newTitle)
            }
        })
        if(updateBlogPostComment.value && result.value)
            res.json(result.value);
    }catch(error){
        next(error);
    }
}

/**
 * @swagger
 * /api/posts/{slug}:
 *   delete:
 *     summary: Delete blog post by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema: 
 *           type: string
 *         required: true
 *         description: The blog post slug
 *     responses:
 *       200:
 *         description: The blog post was deleted
 *       404:
 *         description: The blog post was not deleted
 */

// Deletes blog based on passed slug
export async function deleteBlog(req: Request<ParamsWithSlug, {}, {}>, res: Response<{}>, next:NextFunction){
    try{
        const result = await Blogs.findOneAndDelete({
            "blogPost.slug": req.params.slug,
        });
        if(!result.value){
            res.status(404);
            throw new Error(`Blog with id "${req.params.slug}" not found.`)
        }
        res.status(200).end()
    } catch (error) {
        next(error);
    }
}
