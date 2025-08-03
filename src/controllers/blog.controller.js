import Blog from "../models/blog.model.js";
import generateSlug from "../helpers/generateSlug.js";
import handler from "../utils/handler.utils.js";
import ApiResponse from "../utils/ApiResponse.js";
import isValidBody from "../helpers/isValidBody.js";
import User from "../models/user.model.js";


export const createBlog = handler(async (req, res) => {
    const { title, category, body } = req.body;

    if (!title) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'Title is required'
        })
    }

    if (!isValidBody(body)) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'Body is not in valid format'
        })
    }

    const slug = generateSlug(title)

    const newBlog = await Blog.create({
        title,
        slug,
        body,
        category: category.length > 0 ? category : [],
        author: req.user._id
    })

    if (!newBlog) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'Failed to create new blog'
        })
    }

    return ApiResponse(res, {
        statusCode: 201,
        message: 'New blog created',
        data: newBlog
    })
})

export const updateBlog = handler(async (req, res) => {
    const { title, category, body } = req.body;
    const { id } = req.params;

    if (!title) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'Title is required'
        })
    }

    if (!isValidBody(body)) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'Body is not in valid format'
        })
    }

    const slug = generateSlug(title)

    const blog = await Blog.findOneAndUpdate({
        id,
        author: req.user._id
    }, {
        title,
        slug,
        body,
        category: category.length > 0 ? category : []
    })

    if (!blog) {
        return ApiResponse(res, {
            statusCode: 404,
            error: 'Blog not found'
        })
    }

    return ApiResponse(res, {
        statusCode: 200,
        message: 'Blog updated',
        data: blog
    })
})

export const deleteBlog = handler(async (req, res) => {
    const { id } = req.params;

    const blog = await Blog.findOneAndDelete({
        id,
        author: req.user._id
    })

    if (!blog) {
        return ApiResponse(res, {
            statusCode: 404,
            error: 'Blog not found'
        })
    }

    return ApiResponse(res, {
        statusCode: 200,
        message: 'Blog deleted'
    })
})

export const getUserBlogs = handler(async (req, res) => {

    const { username } = req.params

    const user = await User.find({ username: username })

    if (!user) {
        return ApiResponse(res, {
            statusCode: 404,
            error: 'User does not exist with this username'
        })
    }

    const blogs = await Blog.find()
        .populate({
            path: 'author',
            match: { username: username },
            select: '-password'
        })

    return ApiResponse(res, {
        statusCode: 200,
        message: `${username} blogs fetched`,
        data: blogs
    })
})

export const getAllBlogs = handler(async (req, res) => {
    const blogs = await Blog.find({})
    .populate({
        path: 'author',
        select: '-password'
    })

    return ApiResponse(res, {
        statusCode: 200,
        message: 'All blogs fetched',
        data: blogs
    })
})