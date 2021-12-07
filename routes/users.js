const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  patchUser,
  avatarUser,
  getCurrentUser,
  getUserById,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const validatorURL = require('../validation/validatorURL');

router.get('/', auth, getUsers);

router.get('/me', auth, getCurrentUser);

router.get(
  '/:userId',
  auth,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().custom(validatorURL),
      email: Joi.string().email(),
      password: Joi.string().min(4),
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
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      email: Joi.string().email(),
      password: Joi.string().min(4),
    }),
  }),
  avatarUser,
);

module.exports = router;
