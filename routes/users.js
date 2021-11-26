const router = require('express').Router();
const {
  getUsers,
  createUser,
  patchUser,
  avatarUser,
  login,
  getCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, patchUser);
router.patch('/me/avatar', auth, avatarUser);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
