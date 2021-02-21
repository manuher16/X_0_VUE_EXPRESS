const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
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