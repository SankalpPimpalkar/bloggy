import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import handler from "../utils/handler.utils.js";
import { JWT_SECRET } from "../constants.js";

export const authenticate = handler(async (req, res, next) => {
    const token = req.cookies?.token || ''

    if (!token) {
        return ApiResponse(res, {
            statusCode: 401,
            error: 'Authentication token missing',
        })
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, JWT_SECRET)
    } catch (err) {
        return ApiResponse(res, {
            statusCode: 401,
            error: 'Invalid or expired token',
        })
    }

    const user = await User.findById(decodedToken._id).select('-password')

    if (!user) {
        return ApiResponse(res, {
            statusCode: 404,
            error: 'User not found',
        })
    }

    req.user = user
    next()
})