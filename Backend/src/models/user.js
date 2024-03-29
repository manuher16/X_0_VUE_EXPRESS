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
    games:[{
        type:mongoose.Types.ObjectId,
        ref:"game"
    }],
    status:{
        type:String,
        default:"Offline"
    },
    invitations:{
        type:Array
    }
})

module.exports = mongoose.model('User', userSchema);