import { Router } from 'express';
import * as CommentController from './comments.controller'


const router = Router();

router.post('/:slug/comments', CommentController.addComment)



export default router;