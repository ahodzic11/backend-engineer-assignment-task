import { Response, Request, NextFunction } from 'express';
import { Blogs } from './blog.model';
import { Tags } from './tags.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - tags
 *       properties:
 *         tags:
 *           type: array
 *           items:
 *              type: string
 *           description: The array of unique tags
 */ 

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tags in the API
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Returns the list of all the tags
 *     tags: [Tags]
 *     responses:
 *       200: 
 *         description: The list of the tags
 *         content:
 *           application/json:
 *             schema:
 *               type: $ref:'#/components/schemas/Tag'
 */

// Returns a list of all the tags
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