import mongoose, { Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import CustomError from '../errors/customError';
import ERROR_MESSAGES from '../errors/errorMessages';

type TUser = {
  email: string;
  password: string;
  name?: string,
  about?: string,
  avatar?: string,
};

type TUserModel = Model<TUser> & {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, TUser>>
}

const userSchema = new mongoose.Schema<TUser, TUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v: string) {
        return validator.isEmail(v);
      },
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v: string) {
        return validator.isURL(v);
      },
    },
  },
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomError(401, ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA);
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    throw new CustomError(401, ERROR_MESSAGES.INCORRECT_AUTHORIZATION_DATA);
  }

  return user;
});

export default mongoose.model<TUser, TUserModel>('user', userSchema);
