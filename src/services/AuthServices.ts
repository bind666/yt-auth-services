import User from '../models/User';

interface IUser {
  email: string;
  name: string;
  hashedPassword: string;
}

class AuthServices {
  constructor(private userRepository: typeof User) {}

  async create(user: IUser) {
    return this.userRepository.create({
      email: user.email,
      name: user.name,
      password: user.hashedPassword,
    });
  }
}

export default AuthServices;
