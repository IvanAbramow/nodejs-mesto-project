import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import ERROR_MESSAGES from '../errors/errorMessages';
import { createUser, login } from '../controllers/users';

const router = Router();

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email()
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле email должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле email не должно быть пустым`,
          'string.email': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле email должно быть в формате email`,
          'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле email`,
        }),
      password: Joi.string()
        .required()
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле password должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле password не должно быть пустым`,
          'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле password`,
        }),
    }).unknown(false).messages({
      'object.unknown': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле {#label} не должно присутствовать`,
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email()
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле email должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле email не должно быть пустым`,
          'string.email': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле email должно быть в формате email`,
          'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле email`,
        }),
      password: Joi.string()
        .required()
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле password должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле password не должно быть пустым`,
          'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле password`,
        }),
      name: Joi.string()
        .min(2)
        .max(30)
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name не должно быть пустым`,
          'string.min': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name должно быть не меньше {#limit} символов`,
          'string.max': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name должно быть не больше {#limit} символов`,
        }),
      about: Joi.string()
        .min(2)
        .max(30)
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about не должно быть пустым`,
          'string.min': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about должно быть не меньше {#limit} символов`,
          'string.max': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about должно быть не больше {#limit} символов`,
        }),
      avatar: Joi.string()
        .uri()
        .messages({
          'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле avatar должно быть строкой`,
          'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле avatar не должно быть пустым`,
          'string.uri': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле avatar должно быть в формате url`,
        }),
    }).unknown(false).messages({
      'object.unknown': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле {#label} не должно присутствовать`,
    }),
  }),
  createUser,
);

export default router;
