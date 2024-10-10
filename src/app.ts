import express from 'express';
import mongoose from 'mongoose';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import errorHandler from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import CONSTANTS from './constants';

const { PORT = CONSTANTS.PORT } = process.env;
const app = express();

mongoose.connect(CONSTANTS.MONGO_URL);

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
