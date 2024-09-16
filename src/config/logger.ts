import winston from 'winston';

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'blue',
};

winston.addColors(colors);
const logger = winston.createLogger({
  level: 'http',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'auth-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({
      filename: 'logs/http.log',
      level: 'http',
      format: winston.format((info) => {
        return info.level === 'http' ? info : false;
      })(),
    }),
  ],
});

export default logger;
