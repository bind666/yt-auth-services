import logger from '../config/logger';

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
