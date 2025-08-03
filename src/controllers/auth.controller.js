import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import handler from "../utils/handler.utils.js";
import isValidEmail from "../helpers/isValidEmail.js";
import { JWT_SECRET } from "../constants.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
}

export const createAccount = handler(async (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'All fields are required'
        })
    }

    const validEmail = isValidEmail(email)

    if (!validEmail) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'Please provide valid email address'
        })
    }

    const existingUser = await User.findOne({ username: username })

    if (existingUser) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'User already exist with this username'
        })
    }

    const newUser = await User.create({
        name,
        email,
        username,
        password
    })

    newUser.toObject()
    delete newUser.password

    return ApiResponse(res, {
        statusCode: 200,
        message: 'New user created'
    })
})

export const loginAccount = handler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return ApiResponse(res, {
            statusCode: 400,
            error: 'All fields are required'
        })
    }

    const user = await User.findOne({ username })

    if (!user) {
        return ApiResponse(res, {
            statusCode: 404,
            error: 'User does not exist with this username',
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return ApiResponse(res, {
            statusCode: 401,
            error: 'Wrong Password'
        })
    }

    const payload = {
        _id: user._id
    }

    user.toObject()
    delete user.password

    const token = jwt.sign(payload, JWT_SECRET)

    res.cookie('token', token, COOKIE_OPTIONS)

    return ApiResponse(res, {
        statusCode: 200,
        message: 'User logged in',
        data: {
            token: token
        }
    })
})

export const getUserDetails = handler(async (req, res) => {
    return ApiResponse(res, {
        statusCode: 200,
        message: 'User fetched Successful',
        data: req.user
    })
})

export const logoutAccount = handler(async (req, res) => {

    res.clearCookie('token', COOKIE_OPTIONS)

    return ApiResponse(res, {
        statusCode: 200,
        message: 'User logout Successful',
    })
})