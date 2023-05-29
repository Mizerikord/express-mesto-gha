const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUserById);

router.post('/', usersController.createUser);

router.patch('/me', usersController.patchUser);

router.patch('/me/avatar', usersController.patchUserAvatar);

module.exports = router;
