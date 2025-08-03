import { Router } from "express";
import { createBlog, updateBlog, deleteBlog, getAllBlogs, getUserBlogs } from "../controllers/blog.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

const blogRouter = Router()

blogRouter.post('/create', authenticate, createBlog)
blogRouter.patch('/:id', authenticate, updateBlog)
blogRouter.delete('/:id', authenticate, deleteBlog)
blogRouter.get('/', getAllBlogs)
blogRouter.get('/:username', getUserBlogs)

export default blogRouter;