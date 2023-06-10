const CardModel = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationErrors');

const getCards = async (req, res, next) => {
  await CardModel.find({})
    .then((cards) => {
      res.status(200).send(cards.map((card) => ({
        name: card.name,
        link: card.email,
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
      console.log(card._id);
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Некорректные данные');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  console.log(cardId);
  const userId = req.user._id;
  CardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      if (card.owner !== userId) {
        throw new ForbiddenError('Не твое, не трогай!');
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
    .catch(next);
};

const cardLike = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.status(200).send({ message: 'Лайк' });
  })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка не найдена');
      }
      if (err.name === 'CastError') {
        throw new ValidationError('Некорректные данные карточки');
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
        throw new NotFoundError('Карточка не найдена');
      }
      res.status(200).send({ like: card.likes, message: 'ДизЛайк' });
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
