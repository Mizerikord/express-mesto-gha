const { celebrate, Joi } = require('celebrate');

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      // eslint-disable-next-line no-useless-escape
      .regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .default('Cardname'),
    link: Joi.string().required()
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      // eslint-disable-next-line no-useless-escape
      .regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  }),
});

module.exports = { validateUser, validateCard };
