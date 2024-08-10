import { config } from 'dotenv';
import * as envVar from 'env-var';

config();

export const env = {
  isProduction: envVar.get('APP_ENV').required().asString() === 'production',
  isStaging: envVar.get('APP_ENV').required().asString() === 'staging',
  isDevelopment: envVar.get('APP_ENV').required().asString() === 'development',
  isTest: envVar.get('APP_ENV').required().asString() === 'test',

  app: {
    env: envVar.get('APP_ENV').required().asString(),
    port: envVar.get('APP_PORT').required().asPortNumber(),
    name: envVar.get('APP_NAME').required().asString(),
  },
  db: {
    url: envVar.get('DB_URL').required().asUrlString(),
  },
  apibara: {
    token: envVar.get('DNA_TOKEN').required().asString(),
    dnaClient: envVar.get('DNA_CLIENT_URL').required().asUrlString(),
  },
};
