import Joi from 'joi';

export function validateEnvs(variables: Record<string, unknown>) {
  const schema = Joi.object({
    CORS_ORIGINS: Joi.array().items(Joi.string()).required(),
    CORS_METHODS: Joi.string().required(),
    NODE_ENV: Joi.string().required(),
    APP_PORT: Joi.number().required(),
    APP_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_LOGGING: Joi.boolean().required(),
    SWAGGER_TITLE: Joi.string().required(),
    SWAGGER_DESCRIPTION: Joi.string().required(),
    SWAGGER_VERSION: Joi.string().required(),
    SWAGGER_PATH: Joi.string().required(),
    SCALAR_PATH: Joi.string().required(),
    ENCRYPTION_KEY: Joi.string().required(),
    ENCRYPTION_VERSION: Joi.string().required(),
    ENCRYPTION_KEY_MIN_LENGTH: Joi.number().required(),
    ENCRYPTION_PREFIX: Joi.string().required(),
    GOOGLE_OAUTH2_CLIENT_ID: Joi.string().required(),
    GOOGLE_OAUTH2_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_OAUTH2_CALLBACK_URL: Joi.string().required(),
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    ACCESS_TOKEN_EXPIRY_MS: Joi.number().required(),
    REFRESH_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_EXPIRY_MS: Joi.number().required(),
    OTP_TOKEN_SECRET: Joi.string().required(),
    OTP_TOKEN_EXPIRY_MS: Joi.number().required(),
    COOKIE_SECRET: Joi.string().required(),
  })
    .unknown(true)
    .options({ stripUnknown: true });

  const { error } = schema.validate(variables, {
    abortEarly: false,
  });

  if (error) {
    throw error?.details.map(detail => `\u001B[31m${detail.message}\u001B[0m`).join(', ');
  }
}
