import app from './app';
import Config from './config/config';
import logger from './config/logger';
import dbConnect from './db/dbConnect';

const startServer = () => {
  const PORT = Config.PORT;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};

dbConnect()
  .then(() => {
    startServer();
  })
  .catch((error) => {
    if (error instanceof Error) {
      logger.error(`Failed to connect db: ${error.message}`);
      process.exit(1);
    }
  });
