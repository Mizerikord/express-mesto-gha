const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateUser } = require('../middlewares/validate');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getCurrentUser);

router.get('/:userId', usersController.getUserById);

router.patch('/me', validateUser, usersController.patchUser);

router.patch('/me/avatar', validateUser, usersController.patchUserAvatar);

module.exports = router;
