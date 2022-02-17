const mongoose = require("mongoose");
const config = require("config");
const {userSchema} = require



const playlistSchema = mongoose.Schema({
  name: { type: String, required: true },
  userId:{type:String},
  desc: { type: String },
  songs: { type: Array, default: [] },
  img: { type: String },
});

// const validate = (playlist) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     user: Joi.string().required(),
//     desc: Joi.string().allow(),
//     songs: Joi.array().items(Joi.string()),
//     img: Joi.string().allow(""),
//   });
//   return schema.validate(playlist);
// };

const Playlist = mongoose.model("playlist", playlistSchema);
module.exports.Playlist = Playlist;
module.exports.playlistSchema = playlistSchema;
