const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post must have a title'],
        trim: true
    },
    content: {
        type: String,
        required:[true, 'Post must have a content']
    },
    image:{
        type: String,
    },
    imagePublicId: {
        type: String,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tags: [String],
    slug: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', postSchema)