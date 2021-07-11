const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    category: {
        type: Number,
        default: 0
    },
    comments: {
        type: String,
        default: ""
    }
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)