const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  patchUser,
  avatarUser,
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

module.exports = router;
