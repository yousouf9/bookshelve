const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const SALT = 10;



const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique:true

    },
    password:{
        type: String,
        required: true,
        minlength: 5
    },
    name:{
        type:String,
        maxlength: 100
    },
    lastname:{
        type:String,
        maxlength:100
    },

    role:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    }
    
})


userSchema.statics.hashpassword =  async( password)=>{
   const salt = await bycrypt.genSalt(SALT);
   return   await bycrypt.hash(password, salt)
}

userSchema.statics.isvalidPassword = async (oldpassword, newpassword)=>{
    return await bycrypt.compare(newpassword, oldpassword);
}

userSchema.methods.generateToken = (id) =>{

    return jwt.sign(id, config.get('jwtPrivate'));
}

userSchema.statics.findByToken = (token) =>{

    return jwt.verify(token, config.get('jwtPrivate'))
}

userSchema.methods.deleteToken = async (token) =>{
       let user = this;
   return await user.User.findOneAndUpdate({token:token},{$unset:{token: 1}},{new: true})
      

}
const User = mongoose.model('User', userSchema);

const validateInput = (data)=>{

    const schema = Joi.object({
       email: Joi.string().email().required(),
       password: Joi.string().alphanum(),
       name: Joi.string().max(100),
       lastname: Joi.string().max(100),
       role: Joi.number(),
       token:Joi.string()
       
    })

    return schema.validate(data, {abortEarly: false});
}

module.exports.User = User;
module.exports.validateUser = validateInput;