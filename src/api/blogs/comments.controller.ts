import { Response, Request, NextFunction } from 'express';
import { Comment, CommentRequestBody, MultipleComments, SingleCommentData } from './comment.model';
import { ParamsWithSlug } from '../../interfaces/ParamsWithSlug';
import { Blog, Blogs, BlogWithId } from './blog.model';

export async function addComment(req: Request<ParamsWithSlug, Comment, CommentRequestBody>, res: Response<Comment>, next: NextFunction){    
    try{
        console.log(req.body)
        const newComment: Comment = {
            comment: {
                id: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                body: req.body.comment.body
            } 
        }
        const result = await Blogs.findOneAndUpdate({
            "blogPost.slug": req.params.slug,
        },{
            $push: { "comments": newComment.comment}
        }, {
            returnDocument: 'after',
        });
        if(!result.value){
            res.status(404);
            console.log(req.params.slug)
            throw new Error(`Blog with id "${req.params.slug}" not found.`);
        }
        res.json(newComment);
    }catch(error){
        next(error);
    }
}

export async function getComments(req: Request<ParamsWithSlug, MultipleComments, {}>, res: Response<MultipleComments>, next: NextFunction){
    try{
        const result = await Blogs.findOne({
            "blogPost.slug": req.params.slug,
        });
        if(!result){
            res.status(404);
            throw new Error(`Blog with id "${req.params.slug}" not found.`);
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


export async function deleteComment(req: Request<ParamsWithSlug, {}, {}>, res: Response<{}>, next:NextFunction){
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