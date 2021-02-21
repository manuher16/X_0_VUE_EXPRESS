const router = require('express').Router();
const User = require("../models/user");
const Game =require('../models/game')
// password encrypt
const bcrypt = require('bcrypt');

// validation
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');

const schemaRegister = Joi.object({
    fullName: Joi.string().required(),
    password: Joi.string().min(6).max(1024).required(),
    username: Joi.string().min(6).required(),
})

const schemaLogin = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required()
})

router.post('/register', async (req, res) => {
    // validate user
    const {
        error
    } = schemaRegister.validate(req.body)
    console.log(error)
    if (error) {
        return res.json({
            error: error.details[0].message
        })
    }

    const isUserNameExist = await User.findOne({ username: req.body.username });
   
    if (isUserNameExist) {
        res.json({
            error: "UserName ya existe"
        })
        return
    }

    const {
        fullName,
        password,
        username
    } = req.body;

    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    const user=new User({
         username:username,
         password:pass,
         fullName:fullName
     })

     try {
        const savedUser = await user.save();
        res.json({
            error: null,
            data: savedUser
        })
     } catch (error) {
        res.json({ error })
     }
});

router.post('/singup', async(req, res) => {
    const {username}=req.body;
    const user=await User.findOne({username:username})
    if(user){
        if(user.status == "OffLine" || user.status=="Ingame"){
            res.json({
                message:`No se puede cerrar sesion ${username}`
            })
        }
    }
    await User.findOneAndUpdate({username:username},{status:"Offline"})
    res.json({message:`${username} a terminado sesion`})
return 	
});

router.post('/login',async (req, res) => {
    const {
        error
    } = schemaLogin.validate(req.body)
    if(error){
        res.status(400).json({error})
        return
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.json({ error: 'contraseña no válida' })

    //Cambiamos el status del usuario
    await User.findOneAndUpdate({username:req.body.username},{status:"Online"})
     
    // create token
    const token = jwt.sign({
        fullName: user.fullName,
        id: user._id,
        username: user.username,
    }, process.env.TOKEN_SECRET)
 	res.cookie('Token', token, { expires: new Date(Date.now() + 900000), httpOnly: true }).json({token:token})
    
});

router.get('/historial',async (req, res) => {
    const {games} =await  User.findOne({username:req.body.username})
    var historial=[]
    for (let index = 0; index < games.length; index++) {
        historial.push(await Game.findOne({_id:games[index]}))
    }
    res.json({historial})
});

router.get('/online/users', async(req, res) => {
    const usersOnline= await User.aggregate([
        {
          '$search': {
            'text': {
              'query': 'Online', 
              'path': [
                'status'
              ]
            }
          }
        }, {
          '$project': {
            'username': 1, 
            'status': 1
          }
        }
      ])
      res.json({usersOnline})
});
module.exports = router