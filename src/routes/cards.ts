import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  addCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import ERROR_MESSAGES from '../errors/errorMessages';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.base': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле name должно быть строкой`,
        'string.empty': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле name не должно быть пустым`,
        'string.min': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле name должно быть не меньше {#limit} символов`,
        'string.max': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле name должно быть не больше {#limit} символов`,
        'any.required': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: пропущено обязательное поле name`,
      }),
    link: Joi.string()
      .required()
      .messages({
        'string.base': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле link должно быть строкой`,
        'string.empty': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле link не должно быть пустым`,
        'string.uri': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: поле link должно быть в формате url`,
        'any.required': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: пропущено обязательное поле link`,
      }),
  }),
}), addCard);

router.put('/cards/:id/likes', celebrate({
  params: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.base': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть строкой`,
        'string.hex': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть в формате hex`,
        'string.length': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть длиной {#limit} символов`,
      }),
  }),
}), likeCard);

router.delete('/cards/:id', celebrate({
  params: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.base': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть строкой`,
        'string.hex': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть в формате hex`,
        'string.length': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть длиной {#limit} символов`,
      }),
  }),
}), deleteCard);

router.delete('/cards/:id/likes', celebrate({
  params: Joi.object({
    id: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.base': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть строкой`,
        'string.hex': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть в формате hex`,
        'string.length': `${ERROR_MESSAGES.CARD_INCORRECT_DATA}: id должно быть длиной {#limit} символов`,
      }),
  }),
}), dislikeCard);

export default router;
