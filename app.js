require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log({ message: 'Есть контакт' });
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });

app.use(router);
app.use(auth); // Метод используемый для авторизации

app.use(errors()); // Валидация через Joi
app.use(errorHandler); // Централизованная обработка ошибок

app.listen(PORT, () => {
  console.log({ message: `Сервер работает на порту ${PORT}` });
});
