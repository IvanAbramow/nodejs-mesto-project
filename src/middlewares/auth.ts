import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { TAuthenticatedRequest } from '../types';

export default (req: TAuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = jwt.verify(token, 'super-strong-secret');
    next();
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
    next(err);
  }
};
