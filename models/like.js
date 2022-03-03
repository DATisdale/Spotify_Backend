const mongoose = require("mongoose");
const config = require("config");


const likeSchema = mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    songId:{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }
})

const Like =mongoose.model("like", likeSchema)
module.exports.Like=Like;
module.exports.likeSchemae=likeSchema