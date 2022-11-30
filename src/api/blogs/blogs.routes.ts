import { Router } from 'express';
import * as BlogController from './blogs.controller'


const router = Router();

router.post('/', BlogController.createPost)


export default router;