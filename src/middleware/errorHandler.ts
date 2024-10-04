import { isCelebrateError } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../errors/customError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) {
    const errorDetails = Array.from(err.details.entries());
    const errorMessages: string[] = [];

    errorDetails.forEach(([, joiError]) => {
      joiError.details.forEach((detail) => {
        errorMessages.push(detail.message);
      });
    });

    res.status(400).send({ message: errorMessages.join(', ') });
  } else if (err instanceof CustomError) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка сервера' });
  }

  next();
};

export default errorHandler;
