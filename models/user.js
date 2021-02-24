const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error(' Email is invalid')
            }
        }
    },
    password: {
        type: String,
        minlenght: 7,
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value<0){
                throw new Error('age ne peut pas etre inferieur a 0')
            }
        }
    }  
})
const user= mongoose.model("user", userSchema)
module.exports= user