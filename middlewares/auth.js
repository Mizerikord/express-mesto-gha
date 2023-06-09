const jwt = require('jsonwebtoken');
const AutorizationError = require('../errors/AutorizationErrors');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AutorizationError('Ошибка авторизаци');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AutorizationError('Ошибка авторизации');
  }
  req.user = payload;
  next();
};
