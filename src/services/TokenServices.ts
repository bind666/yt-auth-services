import jwt, { JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import Refresh from '../models/Refresh';
import path from 'path';
import Config from '../config/config';
import { Types } from 'mongoose';

class TokenService {
  constructor(private refreshTokenRepository: typeof Refresh) {}
  generateAccessToken(payload: JwtPayload) {
    const secretKey = fs.readFileSync(
      path.join(__dirname, '../../certs/private_key.pem'),
    );
    const accessToken = jwt.sign(payload, secretKey, {
      algorithm: 'RS256',
      expiresIn: '1h',
      issuer: 'auth-service',
    });
    return accessToken;
  }
  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SCERET!, {
      algorithm: 'HS256',
      expiresIn: '1y',
      issuer: 'auth-service',
    });
    return refreshToken;
  }

  async persistRefreshToken(id: Types.ObjectId) {
    console.log(id);
    return await this.refreshTokenRepository.create({
      userid: id,
    });
  }

  async deleteRefreshToken(id: Types.ObjectId, sub: Types.ObjectId) {
    return await this.refreshTokenRepository.deleteOne({
      _id: sub,
      userid: id,
    });
  }
}

export default TokenService;
