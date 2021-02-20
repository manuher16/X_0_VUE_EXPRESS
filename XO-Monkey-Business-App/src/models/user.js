const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    games:{
        type:Array,
        ref:"games"
    },
    status:{
        type:String,
        default:"Offline"
    }
})

module.exports = mongoose.model('User', userSchema);