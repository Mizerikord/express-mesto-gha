const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');

const { JWT_SECRET } = process.env;

const ValidationError = require('../errors/ValidationErrors');
const AutorizationError = require('../errors/AutorizationErrors');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/NotFoundError');

const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = (req, res, next) => {
  UserModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Пользователь не найден');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректные данные');
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel
      .create({
        name, about, avatar, email, password: hash,
      }))
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Некорректные данные');
      }
      if (err.code === 11000) {
        throw new ConflictError('Такая почта уже зарегестрирована');
      }
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  UserModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Некорректные данные');
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => { res.send({ data: user }); })
    .catch(next);
};

const login = (err, req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new AutorizationError('Ошибка авторизации');
      }
      if (err.code === 400) {
        throw new ValidationError('Неправильно набран email');
      }
      if (!bcrypt.compare(password, user.password)) {
        throw new AutorizationError('Ошибка авторизации');
      }
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchUser,
  patchUserAvatar,
  login,
  getCurrentUser,
};
