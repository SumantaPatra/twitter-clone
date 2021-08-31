const mongoose = require('mongoose');
const postschema = new mongoose.Schema({
    content: {
        type: String,
        trim: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweetUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweetData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
}, { timestamps: true });
const post = mongoose.model("post", postschema);
module.exports = post