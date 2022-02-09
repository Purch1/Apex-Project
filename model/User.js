const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   
    firstname: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    lastname: {
        type: String,
        required: true,
        min: 6,
        max: 255
         
    }, 
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
       
    }, 
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    }, 
    email_verify:{
        type: Boolean,
        default: false
    },
    user_verify:{
        type: Boolean,
        default: false
    },
    otp:{
        type: String,
        trim: true,
    },
    otp_expire:{
        type: Date,
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("User", userSchema)