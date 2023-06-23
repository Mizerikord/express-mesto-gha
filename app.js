require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log({ message: 'Соединение установлено' });
  })
  .catch(() => {
    process.exit();
  });

app.use(router);
app.use(auth); // Метод используемый для авторизации

app.use(errors()); // Валидация через Joi
app.use(errorHandler); // Централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
