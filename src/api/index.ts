import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import blogs from "./blogs/blogs.routes"

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json();
});

router.use('/blogs', blogs)

export default router;
