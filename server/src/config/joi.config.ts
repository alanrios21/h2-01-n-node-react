import * as Joi from 'joi';

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod').optional(),
  PORT: Joi.number().integer().optional().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.string().required(),
  COOKIE_TTL: Joi.number().integer().optional().default(3600000),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_PORT: Joi.number().integer().required(),
  DB_HOST: Joi.string().required(),
});
