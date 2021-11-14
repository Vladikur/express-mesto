const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (cards) {
        return res
          .status(200)
          .send(cards);
      }
      return res
        .status(400)
        .send({
          message: 'Переданы некорректные данные для отображения карточек',
        });
    })
    .catch((error) => {
      res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const createCard = (req, res) => {
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
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для создания карточки',
          });
      }
      return res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      return res
        .status(404)
        .send({
          message: 'Запрашиваемая карточка не найдена',
        });
    })
    .catch((error) => {
      res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const putLike = (req, res) => {
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
      return res
        .status(404)
        .send({
          message: 'Передан несуществующий _id карточки',
        });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || 'CastError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для постановки лайка',
          });
      }
      return res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const deleteLike = (req, res) => {
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
      return res
        .status(404)
        .send({
          message: 'Передан несуществующий _id карточки',
        });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || 'CastError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для снятия лайка',
          });
      }
      return res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
