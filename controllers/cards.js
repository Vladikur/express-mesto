const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        return res
          .status(200)
          .send(cards);
      }
      throw new BadRequestError('Переданы некорректные данные для отображения карточек');
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return Card.create({
    name,
    link,
    owner,
  })
    .then((card) => {
      res
        .status(201)
        .send(card);
    })
    .catch(() => {
      next(new BadRequestError('Переданы некорректные данные для создания карточки'));
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      return card;
    })
    .then((card) => {
      if (`${card.owner}` === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => {
            if (deletedCard) {
              res
                .status(200)
                .send(deletedCard);
            }
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Нельзя удалять карточки других пользователей');
      }
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res
          .status(201)
          .send(card);
      }
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else {
        next(error);
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res
          .status(200)
          .send(card);
      }
      throw new NotFoundError('Передан несуществующий _id карточки');
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
