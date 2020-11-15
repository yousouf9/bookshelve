const mongoose = require('mongoose');
const Joi = require('joi');



const bookSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    review:{
        type: String,
        default: 'N/A'
    },
    pages:{
        type: String,
        default: 'N/A'
    },
    rating:{
        type: Number,
        required:true,
        min: 1,
        max: 5 
    },
    price:{
        type: String,
        default: 'N/A'
    },
    ownerId:{
        type: String,
        required:true
    }
}, {timestamps:true})

const Book = mongoose.model('Book', bookSchema);

const validateInput = (data)=>{

    const schema = Joi.object({
       name: Joi.string().required(),
       author: Joi.string().required(),
       review: Joi.string(),
       pages: Joi.string(),
       rating: Joi.number().min(1).max(5),
       price: Joi.string(),
       ownerId: Joi.objectid()
    })

    return schema.validate(data, {abortEarly: false});
}

module.exports.Book = Book
module.exports.validateUser = validateInput;