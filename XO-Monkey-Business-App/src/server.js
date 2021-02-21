const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const uri = require('./database/database');
const app = express();
const verifyToken = require('./routes/token')

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DataBase Conected"))
  .catch((e) => console.log("error db:", e));


  var cors = require('cors')
  app.use(cors()) // Use this after the variable declaration

//importar rutas
app.use('/api/user',require('./routes/user.routes'));
app.use('/api/game', require('./routes/game.routes'));

// iniciar server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server in Port: ${PORT}`)
})