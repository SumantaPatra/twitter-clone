let mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userScema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.jpeg'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    retweets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],

}, { timestamps: true })
userScema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userScema);
module.exports = User;