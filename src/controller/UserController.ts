import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { FetchUserRequest } from '../types';
import UserService from '../services/UserServices';
class UserController {
  constructor(private userService: UserService) {}
  async fetchUsers(req: FetchUserRequest, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { page, limit, order } = req.query;

      const users = await this.userService.fetchUsers(+page, +limit, order);
      res.status(200).json({
        message: 'User fetch successfully!!',
        users,
      });
    } catch (error) {
      next(error);
    }
  }
}

// fetch, ban-unban,

export default UserController;
