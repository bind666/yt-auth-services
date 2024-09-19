import { Response, NextFunction } from 'express';
import { AuthServices } from '../services';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import User from '../models/User';
import { UserSignUpRequest } from '../types';

class AuthController {
  constructor(private authServices: AuthServices) {}
  //Promise<void>
  async register(
    req: UserSignUpRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name } = req.body;
      this.authServices.run();

      let user = await User.findOne({ email });
      if (user) {
        const err = createHttpError(400, `Email already exist.`);
        next(err);
        return;
      }

      user = await User.create({ email, password, name });
      res.status(200).json({ user, message: 'User created.' });
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default AuthController;
