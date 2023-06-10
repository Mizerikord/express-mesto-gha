const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCard } = require('../middlewares/validate');

router.get('/', cardsController.getCards);

router.post('/', validateCard, cardsController.createCard);

router.delete('/:cardId', cardsController.deleteCard);

router.put('/:cardId/likes', cardsController.cardLike);

router.delete('/:cardId/likes', cardsController.cardLikeDelete);

module.exports = router;
