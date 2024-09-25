import User from '../models/User';

class QueryServices {
  constructor(private userRepository: typeof User) {}

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email: email });
  }

  async findById(id: string) {
    return await this.userRepository.findById(id);
  }
}

export default QueryServices;
