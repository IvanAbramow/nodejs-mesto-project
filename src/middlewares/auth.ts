import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { TAuthenticatedRequest } from '../types';
import ERROR_MESSAGES from '../errors/errorMessages';
import CustomError from '../errors/customError';
import CONSTANTS from '../constants';

export default (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    next(new CustomError(401, ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
    return;
  }

  try {
    req.user = jwt.verify(authorization, CONSTANTS.SECRET_KEY);
    next();
  } catch (err) {
    next(new CustomError(401, ERROR_MESSAGES.AUTHORIZATION_REQUIRED));
  }
};
