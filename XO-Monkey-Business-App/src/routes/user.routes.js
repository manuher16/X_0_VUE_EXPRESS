const router = require('express').Router();
const User = require("../models/user");
// constraseña
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
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const isUserNameExist = await User.findOne({
        username: req.body.username
    });
    console.log(isUserNameExist)
    if (isUserNameExist) {
        res.status(400).json({
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
        res.status(400).json({ error })
     }
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
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'contraseña no válida' })
    //Cambiamos el status del usuario
    await User.findOneAndUpdate({username:req.body.username},{status:"Online"})
     
    // create token
    const token = jwt.sign({
        fullName: user.fullName,
        id: user._id,
        username: user.username,
    }, process.env.TOKEN_SECRET)
 	res.json({token:token})
});
module.exports = router