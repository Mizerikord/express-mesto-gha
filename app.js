const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

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

app.use((req, res, next) => {
  req.user = {
    _id: '647378c361e28b541f099b20', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log({ message: `Сервер работает на порту ${PORT}` });
});
