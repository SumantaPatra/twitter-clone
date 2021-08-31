const mongoose = require('mongoose');
const chatschema = new mongoose.Schema({
    content:{
        type:String,
        trim:true
    },
    user:{
        type:String
    }
},{timestamps:true});

const chat = mongoose.model("chat",chatschema);
module.exports = chat