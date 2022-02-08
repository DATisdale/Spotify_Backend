const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema =mongoose.Schema({
    name: {type: String, required: true, minLength: 3, maxLenght: 50 },
    email: {type: String, unique: true, required: true, minLength: 3, maxLength: 50},
    password: {type: String, required : true, minLength: 3, maxLength: 1024},
    likedSongs: {type:[String],default:[]},
    playlist: {type:[String],default:[]},
    month:{type:String, required:true},
    date:{type:String, required: true},
    year:{type:String, required:true},
    isAdmin: {type:Boolean, defailt:false},
})


userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        name: this.name,
        email: this.email,
        isAdmin: this.isAdmin,
      },
      config.get("JWT_SECRET")
    );
  };
  const validateUser = (user) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(50).required().email(),
      password: Joi.string().min(5).max(1024).required(),
      isAdmin: Joi.bool().required(),
      month: Joi.string().required(),
      date: Joi.string().required(),
      year: Joi.string().required()
    });
    return schema.validate(user);
  };
  
  const validateLogin = (req) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(50).required().email(),
      password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(req);
  };
const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;