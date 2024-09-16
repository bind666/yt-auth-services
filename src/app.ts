import express from 'express';
import morgan from 'morgan';
import { morganStream } from './utils';

const app = express();

app.use(morgan('tiny', { stream: morganStream }));
app.use(express.json({ limit: '1MB' }));
app.use(express.urlencoded({ extended: true, limit: '1MB' }));

export default app;
