import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { ErrorMessages, TAuthContext } from '../types';
import CustomError from '../errors/customError';

export const getCards = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  try {
    const cards = await Card.find({ owner: res.locals.userId });
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

export const addCard = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  try {
    await Card.create({ name, link, owner: res.locals.userId })
      .then((card) => {
        res.status(201).json(card);
      }).catch(() => {
        throw new CustomError(400, ErrorMessages.BadRequest);
      });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await Card.findByIdAndDelete(id)
      .then((card) => {
        if (card === null) {
          throw new CustomError(404, 'Карточка с указанным id не найдена');
        } else {
          res.send({ message: 'Карточка удалена' });
        }
      }).catch(() => {
        throw new CustomError(404, 'Карточка с указанным id не найдена');
      });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: res.locals.userId } },
      { new: true },
    ).then((card) => {
      if (card === null) {
        throw new CustomError(404, 'Передан несуществующий id карточки');
      } else {
        res.json(card);
      }
    }).catch(() => {
      throw new CustomError(404, 'Передан несуществующий id карточки');
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, 'Переданы некорректные данные для постановки лайка'));
    } else {
      next(error);
    }
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: res.locals.userId } },
      { new: true },
    ).then((card) => {
      res.json(card);
    }).catch(() => {
      throw new CustomError(404, 'Передан несуществующий id карточки');
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, 'Переданы некорректные данные для снятия лайка'));
    } else {
      next(error);
    }
  }
};
