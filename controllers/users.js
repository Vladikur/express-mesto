const SALT_ROUNDS = 10;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .status(200)
        .send({
          token,
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users) {
        return res
          .status(200)
          .send(users);
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({
    email,
  })
    .then((userEmail) => {
      if (userEmail) {
        throw new ConflictError('Пользователь с таким email зарегистрирован');
      }

      return bcrypt.hash(password, SALT_ROUNDS)
        .then((hash) => User.create({
          email,
          password: hash,
        }))
        .then((user) => {
          if (user) {
            res
              .status(201)
              .send({ email: user.email, id: user._id });
          }
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные для создания пользователя'));
          }

          next(error);
        });
    })
    .catch(next);
};

const patchUser = (req, res, next) => {
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
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для изменения данных пользователя'));
      }

      next(error);
    });
};

const avatarUser = (req, res, next) => {
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
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для изменения аватара'));
      }

      next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send(user);
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      next(error);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .send({
            id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
          });
      }
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    })

    .catch((error) => {
      if (error.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }

      next(error);
    });
};

module.exports = {
  getUsers,
  createUser,
  patchUser,
  avatarUser,
  login,
  getCurrentUser,
  getUserById,
};
