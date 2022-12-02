import { Router } from 'express';
import * as BlogController from './blogs.controller'


/**
 * @swagger
 * /healthcheck:
 *  get:
 *    tag:
 *      - Healthcheck
 *      description: Responds if the app is up and running
 *      responses:
 *        200:      
 *          description: App is up and running
 */ 

const router = Router();

router.get('/:slug', BlogController.findBlog)
router.get('/:tag?', BlogController.listBlogPosts)
router.post('/', BlogController.createBlog)
router.put('/:slug', BlogController.updateBlog)
router.delete('/:slug', BlogController.deleteBlog)

export default router;