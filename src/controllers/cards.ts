import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Card from '../models/card';
import { TAuthenticatedRequest } from '../types';
import CustomError from '../errors/customError';
import ERROR_MESSAGES from '../errors/errorMessages';

export const getCards = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const cards = await Card.find({ owner: userId });
    res.json(cards);
  } catch (error) {
    next(error);
  }
};

export const addCard = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    link,
  } = req.body;

  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const card = await Card.create({
      name,
      link,
      owner: userId,
    });

    if (!card) {
      next(new CustomError(400, ERROR_MESSAGES.CARD_INCORRECT_DATA));
    }

    res.status(201).json(card);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const card = await Card.findById(id);
    if (!card) {
      next(new CustomError(404, ERROR_MESSAGES.CARD_NOT_FOUND));
    }

    if (card && card.owner.toString() !== userId) {
      next(new CustomError(403, ERROR_MESSAGES.USER_NOT_PERMITTED_TO_DELETE_CARD));
    }

    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      next(new CustomError(404, ERROR_MESSAGES.CARD_NOT_FOUND));
    }

    res.send({ message: 'Карточка удалена' });
  } catch (error) {
    next(error);
  }
};

export const likeCard = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const card = await Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      next(new CustomError(404, ERROR_MESSAGES.CARD_NOT_FOUND));
    }

    res.json(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.LIKE_CARD_INCORRECT_DATA));
    }

    next(error);
  }
};

export const dislikeCard = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const card = await Card.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      next(new CustomError(404, ERROR_MESSAGES.CARD_NOT_FOUND));
    }

    res.json(card);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.DISLIKE_CARD_INCORRECT_DATA));
    }

    next(error);
  }
};
