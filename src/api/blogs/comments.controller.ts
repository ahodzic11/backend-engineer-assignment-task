import { Response, Request, NextFunction } from 'express';
import { Comment, CommentRequestBody, CommentWithId, MultipleComments, SingleCommentData } from './comment.model';
import { ParamsWithSlug } from '../../interfaces/ParamsWithSlug';
import { Blog, Blogs } from './blog.model';
import { ParamsWithSlugAndID } from '../../interfaces/ParamsWithSlugAndID';

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

