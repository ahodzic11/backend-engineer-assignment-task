import { Router } from 'express';
import * as BlogController from './blogs.controller'


const router = Router();

router.post('/', BlogController.createBlog)
router.put('/:slug', BlogController.updateBlog)
router.delete('/:slug', BlogController.deleteBlog)


export default router;