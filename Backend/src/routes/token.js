const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');

const verifyToken = (req, res, next) => {
  const token = req.header('user-token');
  
  if (!token ) return res.status(401).json({ error: "access denied" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified
    next()
  } catch (error) {
    res.status(400).json({ error: 'token is not valid'});
  }
}

module.exports = verifyToken;