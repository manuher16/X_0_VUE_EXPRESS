const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    player1:{
        type:String,
        required:true,
        ref:'user'
    },
    player2:{
        type:String,
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
    },
    board:{
        type:Array,
        
    },
    rounds:{
        type:Number,
        
    }
})

module.exports=mongoose.model("game",gameSchema);