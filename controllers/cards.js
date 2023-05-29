const CardModel = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await CardModel.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({
      message: 'Internal Server Error',
      err: err.message,
      stack: err.stack,
    });
  }
};

const createCard = (req, res) => {
  CardModel
    .create({ ...req.body, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
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

const deleteCard = (req, res) => {
  CardModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then(() => {
      res.status(200).send({
        message: 'Карточка успешно удалена',
      });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'User Not Found',
        });
        return;
      }
      if (err.message === 'CastError') {
        res.status(400).send({
          message: 'Некорректный ID',
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

const cardLike = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new Error('NotFound');
  })
    .then(() => res.send({ message: 'Лайк' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Card Not Found',
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      if (err.message === 'CastError') {
        res.status(400).send({
          message: 'Некорректный ID',
          err: err.message,
          stack: err.stack,
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

const cardLikeDelete = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(() => res.send({ message: 'ДизЛайк' }))
    .catch((err) => {
      console.log(err.message, err.stack, err.name);
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Card Not Found',
          err: err.message,
          stack: err.stack,
        });
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Некорректный ID',
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

module.exports = {
  getCards,
  deleteCard,
  createCard,
  cardLike,
  cardLikeDelete,
};
