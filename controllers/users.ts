import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import { TAuthContext } from '../src/types';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    res.status(404).send({ error: `Пользователь по указанному _id: ${userId} - не найден` });
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  try {
    const newUser = await User.create({ name, about, avatar });
    res.status(201).json(newUser);
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
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.userId,
      { name, about, avatar },
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (
  req: Request,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.userId,
      { avatar },
      { new: true },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
