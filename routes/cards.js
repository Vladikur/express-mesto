const router = require('express').Router();
const {
  getCard,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');
const auth = require('../middlewares/auth');

router.get('/', auth, getCard);
router.post('/', auth, createCard);
router.delete('/:cardId', auth, deleteCard);
router.put('/:cardId/likes', auth, putLike);
router.delete('/:cardId/likes', auth, deleteLike);

module.exports = router;
