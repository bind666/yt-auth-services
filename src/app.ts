/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { morganStream } from './utils';
import { HttpError } from 'http-errors';
import userRouter from './routes/auth.route';
import cookieParser from 'cookie-parser';

const app = express();
app.use(morgan('tiny', { stream: morganStream }));

app.use(express.json({ limit: '1MB' }));
app.use(express.urlencoded({ extended: true, limit: '1MB' }));
app.use(express.static('public'));
app.use(cookieParser());

//Routes
app.use('/api/v1/user', userRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    errors: [
      {
        statusCode,
        type: err.name,
        msg: err.message,
        url: req.url,
        ip: req.ip,
        successs: false,
        stack: err.stack,
      },
    ],
  });
});

export default app;
