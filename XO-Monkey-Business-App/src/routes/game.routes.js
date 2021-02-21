const router = require('express').Router();
const Game = require('../models/game')
const Joi = require('@hapi/joi');
const User = require('../models/user');

const schemaCreateGame = Joi.object({
    player1: Joi.string().required(),
    player2: Joi.string().max(1024).required(),
})

 router.get('/games', (req, res) => {
 return 	
 });

 router.get('/game/:id', (req, res) => {
 return 	
 });

 router.post('/create/game', async(req, res) => {
    
    const{error}=schemaCreateGame.validate(req.body)
    console.log(error)
    if(error){
        res.status(400).json({error:"No se pudo crear la partida",error})
        return
    }
    const isPlayer1Exist= await User.findOne({username:req.body.player1})
    const isPlayer2Exist= await User.findOne({username:req.body.player2})
    console.log({isPlayer1Exist})
    if(!isPlayer1Exist && !isPlayer2Exist){
        res.json({error:"Players invalidos"})
        return
    }
    const game =new Game({
        player1:req.body.player1,
        player2:req.body.player2
    })
    try {
        const saveGame= await game.save()
        res.json({
            error:error,
            data:saveGame
        })
    } catch (er) {
        res.json({er})
    }
 return 	
 });
module.exports=router;