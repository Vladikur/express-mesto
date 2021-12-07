const path = require('path');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const {
  createUser,
  login,
} = require('./controllers/users');
const validatorURL = require('./validation/validatorURL');
const NotFoundError = require('./errors/not-found-err');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
const app = express();

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
      avatar: Joi.string().custom(validatorURL),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

app.use('/', auth, routes);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не существует'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => /* eslint-disable no-console */console.log('ok'));
