const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCard } = require('../middlewares/validate');

router.get('/', cardsController.getCards);

router.post('/', validateCard, cardsController.createCard);

router.delete('/:cardId', cardsController.deleteCard);

router.put('/:cardId/likes', validateCard, cardsController.cardLike);

router.delete('/:cardId/likes', validateCard, cardsController.cardLikeDelete);

module.exports = router;
