import { Response, Request, NextFunction } from 'express';
import { Comment, CommentRequestBody, MultipleComments } from '../models/comment';
import { ParamsWithSlug } from '../../interfaces/ParamsWithSlug';
import { BlogComment, BlogCommentsDB } from '../models/blogcomments';
import { Blogs } from '../models/blog';
import { ParamsWithSlugAndID } from '../../interfaces/ParamsWithSlugAndID';

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: object
 *           required: 
 *             - id
 *             - createdAt
 *             - updatedAt
 *             - body
 *           properties:
 *             id:
 *               type: number
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *             body:
 */ 

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments in the API
 */


/**
 * @swagger
 * /api/posts/{slug}/comments:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Comments]
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
 *               - comment
 *             properties:
 *               comment: 
 *                 type: object
 *                 required: 
 *                   - body
 *                 properties:
 *                   body:
 *                     type: string
 *     responses:
 *       200:
 *         description: The blog post comment was successfully created
 *         contents:
 *           application/json:
 *             schema: $ref:'#/components/schemas/Comment'
 *       404:
 *         description: The blog post comment was not created
 */

// Adds a comment to specific blog post based on passed slug
export async function addComment(req: Request<ParamsWithSlug, Comment, CommentRequestBody>, res: Response<Comment>, next: NextFunction){    
    try{
        
        // Checking to see whether the blog exists and can be commented on
        const resultBlog = await Blogs.findOne({
            "blogPost.slug": req.params.slug
        });
        if(!resultBlog){
            res.status(404);
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }
        // Checking to see if there is a blog comment already in the database
        const result = await BlogCommentsDB.findOne({
            "blogSlug": req.params.slug
        });
        const newComment: Comment = {
            comment: {
                id: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                body: req.body.comment.body
            } 
        }
        // blogComment is not in the database
        if(result === null){
            const blogComment: BlogComment = {
                blogSlug: req.params.slug,
                comments: [newComment.comment]
            }
            const insert = await BlogCommentsDB.insertOne(blogComment)
            if(!insert.acknowledged) throw new Error(`Error inserting a new blogComment.`);

        }else{
            // blogComment is in the database
            let newCommentId = Number(result.comments.length + 1)
            newComment.comment.id = newCommentId
            const adding = await BlogCommentsDB.findOneAndUpdate({
                "blogSlug": req.params.slug,
            },{
                $push: {comments: newComment.comment},
            }, {
                returnDocument: 'after',
            });
            if(!adding){
                res.status(404);
                throw new Error(`Error adding comment with id "${newComment.comment.id}" to BlogSlug ${req.params.slug}`);
            }
            res.status(201);
            res.json(newComment)
        }
        
    }catch(error){
        next(error);
    }
}


/**
 * @swagger
 * /api/posts/{slug}/comments:
 *   get:
 *     summary: Returns the list of all the blog post comments
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog post slug
 *     responses:
 *       200: 
 *         description: The list of the blog post comments
 *         content:
 *           application/json:
 *             schema:
 *               type: $ref:'#/components/schemas/Comment'
 */

// Gets comments from a blog post based on passed slug
export async function getComments(req: Request<ParamsWithSlug, MultipleComments, {}>, res: Response<MultipleComments>, next: NextFunction){
    try{
        // Checking to see if there's a blogComment
        const result = await BlogCommentsDB.findOne({
            "blogSlug": req.params.slug,
        });
        if(!result){
            res.status(404);
            throw new Error(`BlogComment with slug "${req.params.slug}" not found.`);
        }
        let allBlogComments: MultipleComments = {
            comments: []
        }
        result.comments.forEach(comment => {
            allBlogComments.comments.push(comment)
        });
        res.json(allBlogComments);
    }catch (error) {
        next(error);
    }
}

/**
 * @swagger
 * /api/posts/{slug}/comments/{id}:
 *   delete:
 *     summary: Delete blog post by slug
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema: 
 *           type: string
 *         required: true
 *         description: The blog post slug
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Blog post comment ID
 *     responses:
 *       200:
 *         description: The blog post was deleted
 *       404:
 *         description: The blog post was not deleted
 */

// Deletes a comment from a blog post by it's ID
export async function deleteComment(req: Request<ParamsWithSlugAndID, {}, {}>, res: Response<{}>, next:NextFunction){
    try{
        let commentId: Number = Number(req.params.id)

        const result = await BlogCommentsDB.findOneAndUpdate({
            "blogSlug": req.params.slug
        },{
            $pull: { comments: {id: commentId} },
        }, {
            returnDocument: 'after',
        });

        if(!result.value){
            res.status(404);
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }
        res.json(200);
    }catch(error){
        next(error);
    }
}