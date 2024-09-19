/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import AuthController from '../controller/AuthController';
import { AuthServices } from '../services';
import { userRegisterValidator } from '../validator/auth-validator';
import { UserSignUpRequest } from '../types';

const userRouter = Router();
const authServices = new AuthServices();
const authController = new AuthController(authServices);
userRouter.post(
  '/register',
  userRegisterValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req as UserSignUpRequest, res, next),
);

export default userRouter;
