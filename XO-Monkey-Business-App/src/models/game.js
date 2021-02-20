const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    player1:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'user'
    },
    player2:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'user'
    },
    p1:{
        type:Array,
        required:true
    },
    p2:{
        type:Array,
        required:true
    }
})

module.exports=mongoose.model("game",gameSchema);