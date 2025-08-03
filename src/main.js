import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { MONGO_URI, PORT } from "./constants.js";
import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

// routes
app.use('/users', authRouter)
app.use('/blogs', blogRouter)
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Server is up and running'
    })
})

// listening and connection
mongoose.connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log("✅✅✅ MongoDB connected successfully! 🚀")
            console.log(`Server is listening at http://localhost:${PORT}`)
        })
    })
    .catch(() => {
        console.error("❌ MongoDB connection failed! 💥");
        console.error("📛 Error:", error.message);
        process.exit(1);
    })