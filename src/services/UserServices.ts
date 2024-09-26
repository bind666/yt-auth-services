import User from '../models/User';

class UserService {
  constructor(private userRepository: typeof User) {}

  async fetchUsers(page: number, limit: number, order: string) {
    await this.userRepository
      .find({})
      .skip((page - 1) * 10)
      .limit(limit)
      .sort({ name: order === 'asc' ? 1 : -1 });
  }
}

export default UserService;
