import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import { TAuthContext } from '../src/types';

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
    const newCard = await Card.create({ name, link, owner: res.locals.userId });
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndDelete(cardId);

    if (!deletedCard) {
      res.status(404).send({ error: `Карточка с указанным _id: ${cardId} не найдена.` });
    }

    res.status(200).send({ message: `Карточка с указанным _id: ${cardId} удалена.` });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: res.locals.userId } },
      { new: true },
    );

    res.status(200).json(card);
  } catch (error) {
    res.status(404).send({ error: `Карточка с указанным _id: ${cardId} не найдена.` });
    next(error);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: res.locals.userId } },
      { new: true },
    );

    if (!card) {
      res.status(404).send({ error: `Карточка с указанным _id: ${cardId} не найдена.` });
    } else {
      res.status(200).json(card);
    }
  } catch (error) {
    next(error);
  }
};
