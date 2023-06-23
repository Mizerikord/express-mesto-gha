const router = require('express').Router();
const cors = require('cors');
const usersController = require('../controllers/users');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');
const { validateUser } = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const { requestLogger, errorLogger } = require('../middlewares/logger');

router.use(requestLogger);

router.use(cors());

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
});

router.post('/signin', validateUser, usersController.login);
router.post('/signup', validateUser, usersController.createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use(errorLogger);

router.use('*', () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = router;
