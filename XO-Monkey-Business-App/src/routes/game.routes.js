const router = require('express').Router();
const Game = require('../models/game')
const Joi = require('@hapi/joi');
const User = require('../models/user');

const schemaCreateGame = Joi.object({
    player1: Joi.string().required(),
    player2: Joi.string().max(1024).required(),
    rounds:Joi.number().min(1).max(10).required()
})

router.get('/games', (req, res) => {
    return
});



router.get('/game/:id', (req, res) => {
    return
});

router.post('/create/game', async (req, res) => {
    console.log(req.body)
    const {error } = schemaCreateGame.validate(req.body)

    if (error) {
        res.json({
            error: "No se pudo crear la partida",
            description:error
        })
        return
    }

    const isPlayer1Exist = await User.findOne({ username: req.body.player1 })
    const isPlayer2Exist = await User.findOne({ username: req.body.player2 })
  
    if (isPlayer1Exist == null || isPlayer2Exist == null) {
        res.json({
            error: "Players invalidos"
        })
        return
    }

    if (isPlayer1Exist.status != "Online") {
        res.json({
            error: `No se puede emparejar con ${isPlayer1Exist.username}`
        })
        return
    }
    if (isPlayer2Exist.status != "Online") {
        res.json({
            error: `No se puede emparejar con ${isPlayer2Exist.username}`
        })
        return
    }
    await User.findOneAndUpdate({ username: isPlayer1Exist.username }, {  status: "Ingame"})
    await User.findOneAndUpdate({   username: isPlayer2Exist.username}, {   status: "Ingame" })

    const game = new Game({
        player1: req.body.player1,
        player2: req.body.player2,
        rounds:req.body.rounds
    })

    try {
        const saveGame = await game.save()
        res.json({
            error: error,
            data: saveGame,
            message: "Juego Creado"
        })
        
        const gamesP1=isPlayer1Exist.games;
        const gamesP2=isPlayer2Exist.games;
        gamesP1.push(saveGame._id)
        gamesP2.push(saveGame._id)
        
        await User.findOneAndUpdate({username:isPlayer1Exist.username},{games:gamesP1})
        await User.findOneAndUpdate({username:isPlayer2Exist.username},{games:gamesP2})

    } catch (er) {
        res.json({
            er
        })
    }
});

router.post('/finish/game', async (req, res) => {
    req.body.rounds=2;
    
    const { error} = schemaCreateGame.validate(req.body)
    if (error) {
        res.json({ error})
        return
    }

    const IsInGamep1 = await User.findOne({   username: req.body.player1 })
    const IsInGamep2 = await User.findOne({username: req.body.player2 })

    if (!IsInGamep1 || !IsInGamep2) {
        res.json({
            message: `No existe los usuario ${req.body.player1} o ${req.body.player2}`
        })
    }

    await User.findOneAndUpdate({ username: req.body.player1 }, { status: "Online" })
    await User.findOneAndUpdate({ username: req.body.player2 }, { status: "Online"  })

    res.json({
        message: "Partida finalizada"
    })
});

module.exports = router;