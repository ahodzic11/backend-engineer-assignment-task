import { Response, Request, NextFunction } from 'express';
import { Comment, CommentRequestBody, Comments, CommentWithId, MultipleComments } from './comment.model';
import { ParamsWithSlug } from '../../interfaces/ParamsWithSlug';
import { BlogComment, BlogCommentsDB } from './blogcomments.model';
import { Blog, Blogs } from './blog.model';
import { ParamsWithSlugAndID } from '../../interfaces/ParamsWithSlugAndID';


export async function addComment(req: Request<ParamsWithSlug, CommentWithId, CommentRequestBody>, res: Response<CommentWithId>, next: NextFunction){    
    try{
        
        //check to see whether the blog exists and can be commented on
        const resultBlog = await Blogs.findOne({
            "blogPost.slug": req.params.slug
        });
        if(!resultBlog){
            res.status(404);
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }
        //check to see if there is a blog comment already in the database
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
            console.log("Naslo već jedan takav komentar")
            let newCommentId = Number(result.comments.length + 1)
            newComment.comment.id = newCommentId
            console.log("Ovo je komentar")
            console.log(newComment)
            console.log("Ovo je req.params.slug")
            console.log(req.params.slug)
            const adding = await BlogCommentsDB.findOneAndUpdate({
                "blogSlug": req.params.slug,
            },{
                $push: {comments: newComment.comment},
            }, {
                returnDocument: 'after',
            });
            console.log(adding)
            if(!adding){
                res.status(404);
                throw new Error(`Error adding comment with id "${newComment.comment.id}" to BlogSlug ${req.params.slug}`);
            }
        }
        const insertResult = await Comments.insertOne(newComment);
        if(!insertResult.acknowledged) throw new Error(`Error inserting a new comment.`);
        res.status(201);
        res.json({
        _id: insertResult.insertedId,
        ...newComment,})
        
        
    }catch(error){
        next(error);
    }
}

/*
export async function addComment(req: Request<ParamsWithSlug, CommentWithId, CommentRequestBody>, res: Response<CommentWithId>, next: NextFunction){    
    try{
        
        //check to see whether the blog exists and can be commented on
        const resultBlog = await Blogs.findOne({
            "blogPost.slug": req.params.slug
        });
        if(!resultBlog){
            res.status(404);
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }
        //check to see if there is a blog comment already in the database
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
        //console.log(result)
        if(result === null){
            const blogComment: BlogComment = {
                blogSlug: req.params.slug,
                commentIds: [1]
            }
            const insert = await BlogCommentsDB.insertOne(blogComment)
            if(!insert.acknowledged) throw new Error(`Error inserting a new blogComment.`);

        }else{
            console.log("Naslo već jedan takav komentar")
            console.log(result.commentIds.length)
            let newCommentId = Number(result.commentIds.length + 1)
            newComment.comment.id = newCommentId

            const blogCommentExistance = await BlogCommentsDB.findOne({
                "blogPost.slug": req.params.slug
            }).then(function(probni){
                if(!probni){
                    const blogComment: BlogComment = {
                        blogSlug: req.params.slug,
                        commentIds: probni.
                    }
                    const insert = await BlogCommentsDB.insertOne(blogComment)
                }
            });
    
            if(!blogCommentExistance?.blogSlug){
                res.status(404);
                throw new Error(`BlogComment with slug "${req.params.slug}" not found.`);
            }else{

            }
            

            const adding = await BlogCommentsDB.findOneAndUpdate({
                "blogPost.slug": req.params.slug,
            },{
                $push: {commentIds: newCommentId},
            }, {
                returnDocument: 'after',
            });

            if(!adding){
                res.status(404);
                throw new Error(`Error adding comment with id "${newCommentId}" to BlogSlug ${req.params.slug}`);
            }
        }
        const insertResult = await Comments.insertOne(newComment);
            if(!insertResult.acknowledged) throw new Error(`Error inserting a new comment.`);
            res.status(201);
            res.json({
            _id: insertResult.insertedId,
            ...newComment,})
        
        
    }catch(error){
        next(error);
    }
}
*/


export async function getComments(req: Request<ParamsWithSlug, MultipleComments, {}>, res: Response<MultipleComments>, next: NextFunction){
    try{
        // checking to see if there's a blogComment
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
        console.log(commentId)

        if(!result.value){
            res.status(404);
            console.log(req.params.slug)
            throw new Error(`Blog with slug "${req.params.slug}" not found.`);
        }
        res.json(200);
    }catch(error){
        next(error);
    }
}