const UserModel = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const getUserById = (req, res) => {
  UserModel
    .findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err.name);
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'User Not Found',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'User Not Found',
        });
        return;
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  UserModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Внесены некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      res.status(500).send({
        message: 'Internal Server Error',
        err: err.message,
        stack: err.stack,
      });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  UserModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => { res.status(200).send({ user }); })
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => { res.send({ data: user }); })
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка',
      err: err.message,
      stack: err.stack,
    }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  patchUser,
  patchUserAvatar,
};
