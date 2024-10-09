import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(requestLogger);

app.use(authRouter);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('App is running on port', PORT);
});
