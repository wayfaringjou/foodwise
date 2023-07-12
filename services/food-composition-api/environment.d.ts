import { Environment } from 'src/config/env.config';

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: Environment;
      PORT: number;
      MONGO_USERNAME: string;
      MONGO_PASSWORD: string;
      MONGO_HOST: string;
      MONGO_PORT: number;
      MONGO_DATABASE: string;
    }
  }
}
