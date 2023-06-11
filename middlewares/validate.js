const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string()
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .regex(regex),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required()
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .regex(regex),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .regex(regex),
  }),
});

const validateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }),
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
});

const validateCardId = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24),
  }),
});

const validateUserId = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateUser,
  validateCard,
  validateAvatar,
  validateUserData,
  validateCardId,
  validateUserId,
};
