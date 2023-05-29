const router = require('express').Router();
const process = require('process');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', () => {
  process.on('uncaughtException', (err, origin) => {
    console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
  });
});

module.exports = router;
