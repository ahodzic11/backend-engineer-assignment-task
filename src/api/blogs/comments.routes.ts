import { Router } from 'express';
import * as CommentController from './comments.controller'


const router = Router();

router.post('/:slug/comments', CommentController.addComment)
router.get('/:slug/comments', CommentController.getComments)
router.delete('/:slug/comments/:id', CommentController.deleteComment)

export default router;