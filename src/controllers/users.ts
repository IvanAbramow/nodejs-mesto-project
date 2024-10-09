import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { TAuthContext, TAuthenticatedRequest } from '../types';
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
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    res.status(201).json(newUser);
  } catch (err: any) {
    if (err.code === 11000) {
      next(new CustomError(409, `Пользователь с email ${email} уже существует`));
    } else {
      next(new CustomError(400, ERROR_MESSAGES.USER_INCORRECT_DATA));
    }
  }
};

export const getUserInfo = async (
  req: TAuthenticatedRequest,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  try {
    const requestUser = req.user;
    const userId = typeof requestUser === 'string' ? requestUser : requestUser?._id;

    console.log('userId', userId);

    await User.findById(userId)
      .then((user) => {
        res.json(user);
      }).catch(() => {
        throw new CustomError(400, 'Not found');
      });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.AVATAR_INCORRECT_DATA));
    } else {
      next(error);
    }
  }
};

export const updateUserInfo = async (
  req: TAuthenticatedRequest,
  res: Response<unknown, TAuthContext>,
  next: NextFunction,
) => {
  const { name, about, avatar } = req.body;

  try {
    await User.findByIdAndUpdate(
      req.user,
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });

    res.cookie('authorization', token, {
      maxAge: 604800000,
      httpOnly: true,
      sameSite: true,
    });

    res.send({ message: 'Успешная авторизация' });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.AVATAR_INCORRECT_DATA));
    } else {
      next(new CustomError(401, 'Ошибка авторизации'));
    }
  }
};
