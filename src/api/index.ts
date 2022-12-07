import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import blogs from "./routes/blogs"
import tags from "./routes/tags"
import comments from "./routes/comments"

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json();
});

router.use('/posts', blogs)
router.use('/tags', tags)
router.use('/posts', comments)

export default router;
