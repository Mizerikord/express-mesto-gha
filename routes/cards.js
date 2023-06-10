const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCard, validateCardId } = require('../middlewares/validate');

router.get('/', cardsController.getCards);

router.post('/', validateCard, cardsController.createCard);

router.delete('/:cardId', validateCardId, cardsController.deleteCard);

router.put('/:cardId/likes', validateCardId, cardsController.cardLike);

router.delete('/:cardId/likes', validateCardId, cardsController.cardLikeDelete);

module.exports = router;
