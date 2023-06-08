const router = require('express').Router();
const usersController = require('../controllers/users');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const { validateUser } = require('../middlewares/validate');
const auth = require('../middlewares/auth');

router.post('/signup', validateUser, usersController.createUser);
router.post('/signin', validateUser, usersController.login);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = router;
