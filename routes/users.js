const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  createUser,
  patchUser,
  avatarUser,
  login,
  getCurrentUser,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const validatorURL = require('../validation/validatorURL');

router.get('/', auth, getUsers);
router.get('/me', auth, getCurrentUser);
router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  patchUser,
);
router.patch(
  '/me/avatar',
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validatorURL),
    }),
  }),
  avatarUser,
);
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  createUser,
);

module.exports = router;
