import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUserById, getUsers, updateUserAvatar, updateUserInfo, userInfo,
} from '../controllers/users';
import ERROR_MESSAGES from '../errors/errorMessages';

const urlPattern = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+\.[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)*\/?#?$/i;

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', userInfo);
router.get('/users/:id', celebrate({
  params: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: id должно быть строкой`,
        'string.hex': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: id должно быть в формате hex`,
        'string.length': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: id должно быть длиной {#limit} символов`,
      }),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name должно быть строкой`,
        'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name не должно быть пустым`,
        'string.min': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name должно быть не меньше {#limit} символов`,
        'string.max': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле name должно быть не больше {#limit} символов`,
        'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле name`,
      }),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about должно быть строкой`,
        'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about не должно быть пустым`,
        'string.min': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about должно быть не меньше {#limit} символов`,
        'string.max': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле about должно быть не больше {#limit} символов`,
        'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле about`,
      }),
  }),
}), updateUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(urlPattern)
      .messages({
        'string.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле avatar должно быть строкой`,
        'string.empty': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле avatar не должно быть пустым`,
        'string.pattern.base': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: поле avatar должно быть в формате url`,
        'any.required': `${ERROR_MESSAGES.USER_INCORRECT_DATA}: пропущено обязательное поле avatar`,
      }),
  }),
}), updateUserAvatar);

export default router;
