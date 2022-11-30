import { Router } from 'express';
import * as BlogController from './blogs.controller'


const router = Router();

router.get('/', BlogController.findAll)

export default router;