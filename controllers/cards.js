const CardModel = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationErrors');

const getCards = async (req, res, next) => {
  await CardModel.find({})
    .then((cards) => {
      res.status(200).send(cards.map((card) => ({
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        _id: card._id,
        createdAt: card.createdAt,
      })));
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  CardModel
    .create({ ...req.body, owner: req.user._id })
    .then((card) => {
      res.status(201).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные'));
        return;
      }
      next(err);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  CardModel.findById(cardId)
    .then((card) => {
      const owner = card.owner.toString();
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      if (owner !== userId) {
        next(new ForbiddenError('Не твое, не трогай!'));
        return;
      }
      CardModel
        .findByIdAndRemove(cardId)
        .then((deletedCard) => {
          res.status(200).send({
            data: deletedCard,
            message: 'Карточка успешно удалена',
          });
        });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      next();
    })
    .catch(next);
};

const cardLike = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((newCard) => {
    if (!newCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send(newCard);
  })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Карточка с таким id не найдена'));
        return;
      }
      next(err);
    })
    .catch(next);
};

const cardLikeDelete = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Карточка с таким id не найдена'));
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  cardLike,
  cardLikeDelete,
};
