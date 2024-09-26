/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, NextFunction, Router } from 'express';
import authenticate from '../middleware/authenticate';
import UserService from '../services/UserServices';
import User from '../models/User';
import UserController from '../controller/UserController';
import { FetchUserRequest } from '../types';
import paginationSchema from '../validator/user-validator';

const userRouter = Router();
const userService = new UserService(User);
const userController = new UserController(userService);

userRouter.get(
  '/',
  authenticate,
  paginationSchema,
  (req: Request, res: Response, next: NextFunction) =>
    userController.fetchUsers(req as FetchUserRequest, res, next),
);

export default userRouter;
