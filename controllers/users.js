const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users) {
        return res
          .status(200)
          .send(users);
      }
      return res
        .status(404)
        .send({
          message: 'Запрашиваемый пользователь не найден',
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

const getUsersById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      return res
        .status(404)
        .send({
          message: 'Запрашиваемый пользователь не найден',
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(404)
          .send({
            message: 'Запрашиваемый пользователь не найден',
          });
      }
      return res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res
        .status(201)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для создания пользователя',
          });
      }
      return res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const patchUser = (req, res) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      return res
        .status(404)
        .send({
          message: 'Запрашиваемый пользователь не найден',
        });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для изменения данных пользователя',
          });
      }
      return res
        .status(500)
        .send({
          message: `Ошибка: ${error.message}`,
        });
    });
};

const avatarUser = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      return res
        .status(404)
        .send({
          message: 'Запрашиваемый пользователь не найден',
        });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для изменения аватара',
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
  getUsers,
  getUsersById,
  createUser,
  patchUser,
  avatarUser,
};
