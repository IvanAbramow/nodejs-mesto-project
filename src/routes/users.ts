import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { createUser, getUserById, getUsers, updateUserAvatar, updateUserInfo, } from '../controllers/users';
import { ErrorMessages } from '../types';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:id', celebrate({
  params: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: id должно быть строкой`,
        'string.hex': `${ErrorMessages.BadRequest}: id должно быть в формате hex`,
        'string.length': `${ErrorMessages.BadRequest}: id должно быть длиной {#limit} символов`,
      }),
  }),
}), getUserById);
router.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле name должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле name не должно быть пустым`,
        'string.min': `${ErrorMessages.BadRequest}: поле name должно быть не меньше {#limit} символов`,
        'string.max': `${ErrorMessages.BadRequest}: поле name должно быть не больше {#limit} символов`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле name`,
      }),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле about должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле about не должно быть пустым`,
        'string.min': `${ErrorMessages.BadRequest}: поле about должно быть не меньше {#limit} символов`,
        'string.max': `${ErrorMessages.BadRequest}: поле about должно быть не больше {#limit} символов`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле about`,
      }),
    avatar: Joi.string()
      .required()
      .uri()
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле avatar должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле avatar не должно быть пустым`,
        'string.uri': `${ErrorMessages.BadRequest}: поле avatar должно быть в формате url`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле avatar`,
      }),
  }),
}), createUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле name должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле name не должно быть пустым`,
        'string.min': `${ErrorMessages.BadRequest}: поле name должно быть не меньше {#limit} символов`,
        'string.max': `${ErrorMessages.BadRequest}: поле name должно быть не больше {#limit} символов`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле name`,
      }),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле about должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле about не должно быть пустым`,
        'string.min': `${ErrorMessages.BadRequest}: поле about должно быть не меньше {#limit} символов`,
        'string.max': `${ErrorMessages.BadRequest}: поле about должно быть не больше {#limit} символов`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле about`,
      }),
  }),
}), updateUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .uri()
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле avatar должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле avatar не должно быть пустым`,
        'string.uri': `${ErrorMessages.BadRequest}: поле avatar должно быть в формате url`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле avatar`,
      }),
  }),
}), updateUserAvatar);

export default router;
