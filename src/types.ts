import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export type TAuthenticatedRequest = Request & {
  user?: string | JwtPayload;
};
