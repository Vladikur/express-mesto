const path = require('path');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
const app = express();

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => /* eslint-disable no-console */console.log('ok'));
