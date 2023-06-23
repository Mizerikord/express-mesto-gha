const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user');

const { JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b' } = process.env;

const ValidationError = require('../errors/ValidationErrors');
const AutorizationError = require('../errors/AutorizationErrors');
const NotFoundError = require('../errors/NotFoundError');
const DuplicateError = require('../errors/DuplicateError');

const getUsers = async (req, res, next) => {
  await UserModel.find({})
    .then((users) => {
      res.status(200).send(users.map((carrentUser) => ({
        name: carrentUser.name,
        about: carrentUser.about,
        avatar: carrentUser.avatar,
        email: carrentUser.email,
        _id: carrentUser._id,
      })));
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  UserModel
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректный Id'));
        return;
      }
      next(err);
    })
    .catch(next);
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
        return next(new NotFoundError('Не удалось создать пользователя'));
      }
      return res.status(201).send(
        {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateError({ message: `Email '${err.keyValue.email}' уже занят` }));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные'));
        return;
      }
      next(err);
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        next(new AutorizationError('Необходимо авторизоваться'));
        return;
      }
      if (user.name === name && user.about === about) {
        next(new DuplicateError('Данные совпадают'));
        return;
      }
      UserModel
        .findByIdAndUpdate(
          req.user._id,
          { name, about },
          { new: true, runValidators: true },
        )
        .then((newUser) => {
          if (!newUser) {
            next(new ValidationError('Некорректные данные'));
            return;
          }
          res.status(200).send({
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
            email: newUser.email,
            _id: newUser._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError('Некорректные данные'));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        next(new AutorizationError('Необходимо авторизоваться'));
        return;
      }
      if (user.avatar === avatar) {
        next(new DuplicateError('Аватар совпадает с прежним'));
        return;
      }
      UserModel.findByIdAndUpdate(
        userId,
        { avatar },
        { new: true, runValidators: true },
      )
        .then((newUser) => {
          res.status(200).send({
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
            email: newUser.email,
            _id: newUser._id,
          });
        })
        .catch(next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AutorizationError('Неверный логин или пароль'));
        return;
      }
      if (!bcrypt.compare(password, user.password)) {
        next(new AutorizationError('Неверный логин или пароль'));
        return;
      }
      res.status(200).send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' }),
        status: res.statusCode,
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
