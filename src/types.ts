import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type TAuthContext = {
  userId: string;
};

export type TUser = {
  email: string;
  password: string;
  name?: string,
  about?: string,
  avatar?: string,
};

export type TAuthenticatedRequest = Request & {
  user?: string | JwtPayload;
};

declare global {
  namespace Express {
    interface Request {
      user: TUser
    }
  }
}
