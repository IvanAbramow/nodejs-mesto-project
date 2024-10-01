import { NextFunction, Request, Response } from 'express';
import User from '../models/user';

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
    const user = await User.find({ _id: userId });
    res.send(user.at(0));
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
