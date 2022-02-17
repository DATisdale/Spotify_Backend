const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema =  mongoose.Schema({
  name:{type:String, required:true,minLength:3, maxLength:50},
  email:{type:String, required:true,unique:true, minLength:5, maxLength:255},
  password:{type:String, required:true,minLength:5, maxLength:1024},
  month:{type:String, required:true},
  date:{type:String, required:true},
  year:{type:String, required:true},
  likedSongs:{type:[String], default:[]},
  playlists:{type:[String], default:[]},
  isAdmin: {type: Boolean, default:false}
})


userSchema.methods.generateAuthToken = function(){
  return jwt.sign(
    {
      _id:this._id,
      name:this.name,
    isAdmin:this.isAdmin
  },
    config.get("JWT_SECRET")
  )
 
}

const validateUser = (user) =>{
  const schema = Joi.object({
    name:Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    isAdmin: Joi.bool().required,
    month: Joi.string().required(),
    date: Joi.string().required(),
    year: Joi.string().required(),
  })
  return schema.validate(user)
};

const validateLogin = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(req);
};



const User = mongoose.model("user",userSchema)
module.exports.User = User;
module.exports.userSchema = userSchema
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;