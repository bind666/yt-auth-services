import mongoose from 'mongoose';
import Config from '../../config/config';
import User from '../../models/User';
import app from '../../app';
import request from 'supertest';

describe('POST /register', () => {
  beforeAll(async () => {
    console.log(Config.DB_URI);
    await mongoose.connect(Config.DB_URI!);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('All Fields given', () => {
    it('Should return 200 status code.', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(userData);

      expect(response.statusCode).toBe(200);
      expect((response.body as Record<string, string>).password).not.toBe(
        userData.password,
      );
    });

    it('Should return 400 status code if user exists.', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
        password: 'password123',
      };

      await request(app).post('/api/v1/user/register').send(userData);

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
    });
  });

  describe('Some Fields are missing.', () => {
    it('should return 400 if user body is not given.', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
      };

      const response = await request(app)
        .post('/api/v1/user/register')
        .send(userData);

      expect(response.statusCode).toBe(400);
    });
  });
});

describe('POST /login', () => {
  beforeAll(async () => {
    await mongoose.connect(Config.DB_URI!);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('All Fields given', () => {
    it('should return 200 status code.', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'test',
        password: 'password123',
      };
      const { email, password } = userData;
      const response1 = await request(app)
        .post('/api/v1/user/register')
        .send(userData);
      expect(response1.statusCode).toBe(200);
      const response2 = await request(app)
        .post('/api/v1/user/login')
        .send({ email, password });

      expect(response2.statusCode).toBe(200);

      // expect(response.headers['set-cookie']).toBeDefined();

      // const cookies = response.headers['set-cookie'];
      // const accessTokenCookie = cookies[0];
      // const refreshTokenCookie = cookies[1];

      // expect(accessTokenCookie).toBeDefined();
      // expect(accessTokenCookie).toMatch(/HttpOnly/);
      // expect(refreshTokenCookie).toBeDefined();
      // expect(refreshTokenCookie).toMatch(/HttpOnly/);

      // const accessToken = accessTokenCookie.split(';')[0].split('=')[1];
      // const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
      // expect(accessToken).toBeTruthy();
      // expect(refreshToken).toBeTruthy();
    });
  });
});
