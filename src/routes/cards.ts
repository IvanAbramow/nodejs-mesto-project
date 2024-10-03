import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { addCard, deleteCard, dislikeCard, getCards, likeCard, } from '../controllers/cards';
import { ErrorMessages } from '../types';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object({
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
    link: Joi.string()
      .required()
      .uri()
      .messages({
        'string.base': `${ErrorMessages.BadRequest}: поле link должно быть строкой`,
        'string.empty': `${ErrorMessages.BadRequest}: поле link не должно быть пустым`,
        'string.uri': `${ErrorMessages.BadRequest}: поле link должно быть в формате url`,
        'any.required': `${ErrorMessages.BadRequest}: пропущено обязательное поле link`,
      }),
  }),
}), addCard);

router.put('/cards/:id/likes', celebrate({
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
}), likeCard);

router.delete('/cards/:id', celebrate({
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
}), deleteCard);

router.delete('/cards/:id/likes', celebrate({
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
}), dislikeCard);
export default router;
