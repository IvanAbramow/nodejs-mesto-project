import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { TAuthContext } from '../types';
import CustomError from '../errors/customError';
import ERROR_MESSAGES from '../errors/errorMessages';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await User.findById(id).then((user) => {
      res.json(user);
    }).catch(() => {
      throw new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND);
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  try {
    await User.create({ name, about, avatar }).then((newUser) => {
      res.status(201).json(newUser);
    }).catch(() => {
      throw new CustomError(400, ERROR_MESSAGES.USER_INCORRECT_DATA);
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { name, about, avatar } = req.body;

  try {
    await User.findByIdAndUpdate(
      res.locals.userId,
      { name, about, avatar },
      { new: true, runValidators: true },
    ).then((updatedUser) => {
      res.json(updatedUser);
    }).catch(() => {
      throw new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND);
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.AVATAR_INCORRECT_DATA));
    } else {
      next(error);
    }
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  try {
    await User.findByIdAndUpdate(
      res.locals.userId,
      { avatar },
      { new: true },
    ).then((updatedUser) => {
      res.json(updatedUser);
    }).catch(() => {
      throw new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND);
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.AVATAR_INCORRECT_DATA));
    } else {
      next(error);
    }
  }
};
