import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from '../routes/users';
import cardsRouter from '../routes/cards';
import { TAuthContext } from './types';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb').then().catch((err) => console.log(err));

app.use((req: Request, res: Response<unknown, TAuthContext>, next: NextFunction) => {
  res.locals = {
    userId: '66fc349a4d417609ea51f71c',
  };

  next();
});

app.use(express.json());

app.use(usersRouter);
app.use(cardsRouter);

app.listen(PORT, () => {
  console.log('App is running on port', PORT);
});
