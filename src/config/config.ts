import DotenvFlow from 'dotenv-flow';
DotenvFlow.config();

const { PORT, DB_URI, NODE_ENV, SALT_ROUND, REFRESH_TOKEN_SCERET } =
  process.env;

const Config = {
  PORT,
  DB_URI,
  NODE_ENV,
  SALT_ROUND,
  REFRESH_TOKEN_SCERET,
} as const;

export default Config;
