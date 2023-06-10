const router = require('express').Router();
const usersController = require('../controllers/users');
const { validateAvatar, validateUserData } = require('../middlewares/validate');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getCurrentUser);

router.get('/:userId', usersController.getUserById);

router.patch('/me', validateUserData, usersController.patchUser);

router.patch('/me/avatar', validateAvatar, usersController.patchUserAvatar);

module.exports = router;
