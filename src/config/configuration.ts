// src/config/configuration.ts
import { envSchema } from './env.schema.js';

export default () => {
  const env = envSchema.parse(process.env);

  return {
    NODE_ENV: env.NODE_ENV,
    port: env.PORT,
    database: {
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
    },
  };
};
