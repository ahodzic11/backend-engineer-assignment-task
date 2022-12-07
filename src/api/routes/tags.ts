import { Router } from 'express';
import * as TagsController from '../controllers/tags'


const router = Router();

router.get('/', TagsController.getTags)


export default router;