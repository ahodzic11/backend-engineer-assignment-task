import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import swaggerUI from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc';
import router from './api/blogs/blogs.routes'
import seedDB from './api/seeds'


require('dotenv').config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog Posts API",
      version: "1.0.0",
      description: "Backend engineer asignment task"
    },
  },
  apis: ["./src/api/blogs/blog.model.ts", "./src/api/blogs/blogs.controller.ts", "./src/api/blogs/tags.controller.ts", "./src/api/blogs/comments.controller.ts"]
}
const specs = swaggerJSDoc(options)

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json();
});

app.use('/api/', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


const port = 5000;
app.listen(port, () => {
  seedDB()
  console.log(`Listening: http://localhost:${port}`);
});

export default app;
