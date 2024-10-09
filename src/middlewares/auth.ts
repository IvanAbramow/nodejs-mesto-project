import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { TAuthenticatedRequest } from '../types';
import ERROR_MESSAGES from '../errors/errorMessages';
import CustomError from '../errors/customError';
import SECRET_KEY from '../constants';

export default (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new CustomError(401, ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    next(new CustomError(401, ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
  }
};
