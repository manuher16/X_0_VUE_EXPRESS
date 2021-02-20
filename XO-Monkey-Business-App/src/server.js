const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const database = require('./database/database');
const app = express();

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DataBase Conected"))
  .catch((e) => console.log("Error dataBase:", e));

// iniciar server
const PORT = process.env.PORT || 3030;
app.listen(3030, () => {
    console.log(`Server in Port: ${PORT}`)
})