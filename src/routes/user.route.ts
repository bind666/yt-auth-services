/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import AuthController from '../controller/AuthController';
import { AuthServices } from '../services';
import {
  userLoginValidator,
  userRegisterValidator,
} from '../validator/auth-validator';
import { UserSignInRequest, UserSignUpRequest } from '../types';
import User from '../models/User';
import QueryServices from '../services/QueryServices';
import TokenService from '../services/TokenServices';
import Refresh from '../models/Refresh';

const userRouter = Router();
const authService = new AuthServices(User);
const queryService = new QueryServices(User);
const tokenService = new TokenService(Refresh);
const authController = new AuthController(
  authService,
  queryService,
  tokenService,
);

userRouter.post(
  '/register',
  userRegisterValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req as UserSignUpRequest, res, next),
);

userRouter.post(
  '/login',
  userLoginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req as UserSignInRequest, res, next),
);

export default userRouter;
