// import { Types } from "mongoose";
import { Request } from 'express';
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  email: string;
  name: string;
  password: string;
  devices: number;
}

export interface UserSignUpRequest extends Request {
  body: User;
}

export interface UserSignInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}
