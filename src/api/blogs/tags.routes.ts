import { Router } from 'express';
import * as TagsController from './tags.controller'


const router = Router();

router.get('/', TagsController.getTags)


export default router;