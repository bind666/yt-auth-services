import { Response, NextFunction } from 'express';
import { AuthServices } from '../services';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import {
  AuthenticateReq,
  ChangePasswordRequest,
  UserSignInRequest,
  UserSignUpRequest,
} from '../types';
import QueryServices from '../services/QueryServices';
import logger from '../config/logger';
import bcrypt from 'bcryptjs';
import Config from '../config/config';
import TokenService from '../services/TokenServices';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

class AuthController {
  constructor(
    private authServices: AuthServices,
    private queryService: QueryServices,
    private tokenservice: TokenService,
  ) {}

  async register(req: UserSignUpRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password, name } = req.body;

      let user = await this.queryService.findByEmail(email);
      if (user) {
        const err = createHttpError(400, `Email already exist.`);
        next(err);
        return;
      }

      //hash password

      const hashedPassword = await this.hashPassword(
        +Config.SALT_ROUND!,
        password,
      );

      user = await this.authServices.create({ email, hashedPassword, name });

      logger.info(`User created successfully!!!.`);

      res.status(200).json({ user, message: 'User created.' });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error during user registration: ${error.message}`);
      }
      next(error);
      return;
    }
  }

  async login(req: UserSignInRequest, res: Response, next: NextFunction) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
        return;
      }

      const { email, password } = req.body;

      const user = await this.queryService.findByEmail(email);
      console.log('user:', user);
      if (!user) {
        const err = createHttpError(401, 'Invalid creadintials.');
        next(err);
        return;
      }

      // if (user.devices === 0) {
      //   const err = createHttpError(429, 'Device Limit Exceeded.');
      //   next(err);
      //   return;
      // }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const payload: JwtPayload = {
        id: user._id,
        email: user.email,
      };

      const accessToken = this.tokenservice.generateAccessToken(payload);
      // console.log(accessToken);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60,
        sameSite: 'strict',
      });

      // user.devices = user.devices - 1;
      // await user.save({});

      const refresh = await this.tokenservice.persistRefreshToken(user._id);
      console.log('ref:', refresh);
      const refreshPayload: JwtPayload = {
        ...payload,
        sub: String(refresh._id),
      };

      const refreshToken =
        this.tokenservice.generateRefreshToken(refreshPayload);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'strict',
      });

      res
        .status(200)
        .json({ user: user, message: 'User logged in successfully' });
    } catch (error) {
      next(error);
      return;
    }
  }

  async self(req: AuthenticateReq, res: Response, next: NextFunction) {
    try {
      const { id } = req.auth;
      const user = await this.queryService.findById(id);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticateReq, res: Response, next: NextFunction) {
    try {
      const { id, sub } = req.auth;
      // console.log('🔥🔥🔥🔥🔥🔥');
      await this.tokenservice.deleteRefreshToken(
        new Types.ObjectId(id),
        new Types.ObjectId(sub),
      );

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.status(200).json({ message: 'User logged out successfully.' });
    } catch (error) {
      next(error);
    }
  }

  async hashPassword(saltRound: number, password: string) {
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async changePassword(
    req: ChangePasswordRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { oldPassword, newPassword } = req.body;
      const { email } = req.auth;

      const user = await this.queryService.findByEmail(email);
      if (!user) {
        const err = createHttpError(401, 'Invalid credentials.');
        next(err);
        return;
      }

      const validPassword = await bcrypt.compare(oldPassword, user.password);
      if (!validPassword) {
        const err = createHttpError(401, 'Invalid Credentials.');
        next(err);
        return;
      }

      const hashedPassword = await this.hashPassword(
        +Config.SALT_ROUND!,
        newPassword,
      );

      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
