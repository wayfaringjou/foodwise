import * as Joi from 'joi';
export interface AppConfig {
  nodeEnv: Environment;
  port: number;
  database: MongoConfig;
}

export interface MongoConfig {
  host: string;
  user: string;
  password: string;
  port: number;
  dbName: string;
}

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export const appEnvironmentSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .required(),
  PORT: Joi.number().required(),
  MONGO_USERNAME: Joi.string().required(),
  MONGO_PASSWORD: Joi.string().required(),
  MONGO_HOST: Joi.string().required(),
  MONGO_PORT: Joi.number().required(),
  MONGO_DATABASE: Joi.string().required(),
});

export const appEnvironment = (): AppConfig => {
  const { env } = process;

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    database: {
      host: env.MONGO_HOST,
      user: env.MONGO_USERNAME,
      password: env.MONGO_PASSWORD,
      port: env.MONGO_PORT,
      dbName: env.MONGO_DATABASE,
    },
  };
};
