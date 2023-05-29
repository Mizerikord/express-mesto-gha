const router = require('express').Router();
const cardsController = require('../controllers/cards');

router.get('/', cardsController.getCards);

router.post('/', cardsController.createCard);

router.delete('/', cardsController.deleteCard);

router.put('/:cardId/likes', cardsController.cardLike);

router.delete('/:cardId/likes', cardsController.cardLikeDelete);

module.exports = router;
