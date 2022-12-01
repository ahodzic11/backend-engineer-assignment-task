import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import blogs from "./blogs/blogs.routes"
import tags from "./blogs/tags.routes"
import comments from "./blogs/comments.routes"

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json();
});

router.use('/posts', blogs)
router.use('/tags', tags)
router.use('/posts', comments)

export default router;
