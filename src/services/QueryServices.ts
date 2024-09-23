import User from '../models/User';

class QueryServices {
  constructor(private userRepository: typeof User) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email: email });
  }
}

export default QueryServices;
