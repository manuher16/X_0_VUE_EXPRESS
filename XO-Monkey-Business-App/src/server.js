const express = require('express');
const bodyparser = require('body-parser');
const app = express();

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(require('./database.js'))
// iniciar server
const PORT = process.env.PORT || 3030;
app.listen(3030, () => {
    console.log(`Server in Port: ${PORT}`)
})