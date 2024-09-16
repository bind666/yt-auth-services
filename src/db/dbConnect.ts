import mongoose from 'mongoose';
import logger from '../config/logger';
import Config from '../config/config';

const dbConnect = async () => {
  try {
    const DB_URI = Config.DB_URI!;
    await mongoose.connect(DB_URI);
    logger.info('MongoDB connected successfully.');
    mongoose.connection.on('disconnected', () =>
      logger.info('MongoDB disconnected.'),
    );
    mongoose.connection.on('connected', () =>
      logger.info('MongoDB connected successfully'),
    );
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

export default dbConnect;
