const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getCard,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');
const validatorURL = require('../validation/validatorURL');

router.get('/', auth, getCard);
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(validatorURL),
    }),
  }),
  createCard,
);
router.delete(
  '/:cardId',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCard,
);
router.put(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  putLike,
);
router.delete(
  '/:cardId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteLike,
);

module.exports = router;
