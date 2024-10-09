import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../models/user';
import { TAuthenticatedRequest } from '../types';
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
    const user = await User.findById(id);

    if (!user) {
      next(new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name, about, avatar, email, password: passwordHash,
    });

    res.status(201).json(newUser);
  } catch (err: any) {
    if (err.code === 11000) {
      next(new CustomError(409, ERROR_MESSAGES.USER_EMAIL_ALREADY_EXISTS));
    } else {
      next(new CustomError(400, ERROR_MESSAGES.USER_INCORRECT_DATA));
    }
  }
};

export const userInfo = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const user = await User.findById(userId);
    if (!user) {
      next(new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about, avatar } = req.body;

  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about, avatar },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      next(new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    res.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.AVATAR_INCORRECT_DATA));
    }

    next(error);
  }
};

export const updateUserAvatar = async (
  req: TAuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  try {
    const userParams = req.user as JwtPayload;
    const userId = userParams?._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );

    if (!updatedUser) {
      next(new CustomError(404, ERROR_MESSAGES.USER_NOT_FOUND));
    }

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.AVATAR_INCORRECT_DATA));
    }

    next(error);
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
    }).send({ message: 'Успешная авторизация' });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      next(new CustomError(400, ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA));
    } else {
      next(new CustomError(401, ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
    }
  }
};
