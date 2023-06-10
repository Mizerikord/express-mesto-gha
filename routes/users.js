const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateAvatar, validateUserData, validateUserId } = require('../middlewares/validate');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getCurrentUser);

router.get('/:userId', validateUserId, usersController.getUserById);

router.patch('/me', validateUserData, usersController.patchUser);

router.patch('/me/avatar', validateAvatar, usersController.patchUserAvatar);

module.exports = router;
