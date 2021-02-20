require("dotenv").config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.bdi5y.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`

 module.exports = uri;