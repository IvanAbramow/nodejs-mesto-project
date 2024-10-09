import jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import { TAuthenticatedRequest, TUser } from '../types';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log(authorization);

    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload as TAuthenticatedRequest;

  return next();
};
