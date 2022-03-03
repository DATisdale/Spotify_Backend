const mongoose = require("mongoose");
const config = require("config");


const dislikeSchema = mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    songId:{
        type: Schema.Types.ObjectId,
        ref: 'Song'
    }
})

const Dislike =mongoose.model("dislike", dislikeSchema)
module.exports.Dislike=Dislike;
module.exports.dislikeSchemae=dislikeSchema