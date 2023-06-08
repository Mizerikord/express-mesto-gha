const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);

router.get('/me', usersController.getCurrentUser);

router.get('/:userId', usersController.getUserById);

router.patch('/me', usersController.patchUser);

router.patch('/me/avatar', usersController.patchUserAvatar);

module.exports = router;
