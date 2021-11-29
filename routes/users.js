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
router.patch('/me', auth, patchUser);
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
// Не совсем понял Ваше последнее замечание.
// Мы ведь не отправлям ссылку на автар при регистрации.
// Только емэйл и пароль, а ссылка подставляется дефолтная.
// P.S. почему-то изображения с Вашими скринами не открывались на сайте.

module.exports = router;
