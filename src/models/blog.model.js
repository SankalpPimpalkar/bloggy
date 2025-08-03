import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    content_type: {
        type: String,
        enum: ['image', 'heading', 'paragraph'],
        default: 'body'
    },
    body: {
        type: String,
        trim: true
    },
})

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        trim: true
    },
    body: [contentSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, { timestamps: true })

const Blog = mongoose.model('Blog', blogSchema)
export default Blog