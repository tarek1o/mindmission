import * as Joi from 'joi';
import { EnvironmentEnum } from '../enums/environments.enum';
import { EnvironmentVariableNames } from '../constant/environment-variable-names';
import { NotificationChannelEnum } from 'src/modules/notification/domain/enums/notification-channel.enum';

export const expirationDatePattern = /^(\d+)(second|minute|hour|day|month|year)$/;
const expirationDatePatternErrorMessage = 'can be only in second, minute, hour, day and month';

export const validationSchema = Joi.object({
  [EnvironmentVariableNames.NODE_ENV]: Joi.string()
    .required()
    .valid(...Object.values(EnvironmentEnum)),
  [EnvironmentVariableNames.PORT]: Joi.number().port().required(),
  [EnvironmentVariableNames.APP_NAME]: Joi.string().required(),

  [EnvironmentVariableNames.GRAPHQL_PATH]: Joi.string().required(),
  [EnvironmentVariableNames.GRAPHQL_SORT_SCHEMA]: Joi.boolean().required(),
  [EnvironmentVariableNames.GRAPHQL_INTROSPECTION]: Joi.boolean().required(),

  [EnvironmentVariableNames.NOTIFICATIONS_DEFAULT_CHANNEL]: Joi.string()
    .required()
    .valid(...Object.values(NotificationChannelEnum)),

  [EnvironmentVariableNames.RATE_LIMITER_DEFAULT_TTL]: Joi.number().default(60000),
  [EnvironmentVariableNames.RATE_LIMITER_DEFAULT_LIMIT]: Joi.number().default(10),
  [EnvironmentVariableNames.LOGIN_RATE_LIMITER_DEFAULT_TTL]: Joi.number().default(60000),
  [EnvironmentVariableNames.LOGIN_RATE_LIMITER_DEFAULT_LIMIT]: Joi.number().default(5),
  [EnvironmentVariableNames.VERIFY_SET_FIRST_PASSWORD_RATE_LIMITER_DEFAULT_TTL]: Joi.number().default(60000),
  [EnvironmentVariableNames.VERIFY_SET_FIRST_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT]: Joi.number().default(5),
  [EnvironmentVariableNames.FORGET_PASSWORD_RATE_LIMITER_DEFAULT_TTL]: Joi.number().default(60000),
  [EnvironmentVariableNames.FORGET_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT]: Joi.number().default(5),
  [EnvironmentVariableNames.VERIFY_RESET_PASSWORD_RATE_LIMITER_DEFAULT_TTL]: Joi.number().default(60000),
  [EnvironmentVariableNames.VERIFY_RESET_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT]: Joi.number().default(5),

  [EnvironmentVariableNames.DB_HOST]: Joi.string().required(),
  [EnvironmentVariableNames.DB_PORT]: Joi.number().port().required(),
  [EnvironmentVariableNames.DB_NAME]: Joi.string().required(),
  [EnvironmentVariableNames.DB_USERNAME]: Joi.string().required(),
  [EnvironmentVariableNames.DB_PASSWORD]: Joi.string().required(),
  [EnvironmentVariableNames.DB_MIGRATIONS]: Joi.string().required(),
  [EnvironmentVariableNames.DB_ENTITIES]: Joi.string().required(),

  [EnvironmentVariableNames.REDIS_HOST]: Joi.string().required(),
  [EnvironmentVariableNames.REDIS_PORT]: Joi.number().port().required(),
  [EnvironmentVariableNames.REDIS_USERNAME]: Joi.string().required(),
  [EnvironmentVariableNames.REDIS_PASSWORD]: Joi.string().required(),

  [EnvironmentVariableNames.ACCESS_TOKEN_SECRET_KEY]: Joi.string().required(),
  [EnvironmentVariableNames.ACCESS_TOKEN_EXPIRATION_DURATION]: Joi.string()
    .pattern(expirationDatePattern)
    .message(expirationDatePatternErrorMessage)
    .required(),
  [EnvironmentVariableNames.REFRESH_TOKEN_EXPIRATION_DURATION]: Joi.string()
    .pattern(expirationDatePattern)
    .message(expirationDatePatternErrorMessage)
    .required(),
  [EnvironmentVariableNames.EMAIL_VERIFICATION_TOKEN_EXPIRATION_DURATION]:
    Joi.string()
      .pattern(expirationDatePattern)
      .message(expirationDatePatternErrorMessage)
      .required(),
  [EnvironmentVariableNames.RESET_PASSWORD_TOKEN_EXPIRATION_DURATION]: Joi.string()
    .pattern(expirationDatePattern)
    .message(expirationDatePatternErrorMessage)
    .required(),

  [EnvironmentVariableNames.EMAIL_PROVIDER_HOST]: Joi.string().required(),
  [EnvironmentVariableNames.EMAIL_PROVIDER_PORT]: Joi.number().port().required(),
  [EnvironmentVariableNames.EMAIL_PROVIDER_USERNAME]: Joi.string().required(),
  [EnvironmentVariableNames.EMAIL_PROVIDER_PASSWORD]: Joi.string().required(),

  [EnvironmentVariableNames.DASHBOARD_ORIGIN]: Joi.string().uri().required(),
  [EnvironmentVariableNames.DASHBOARD_RESET_PASSWORD_ROUTE]: Joi.string().uri().required(),
  [EnvironmentVariableNames.DASHBOARD_SET_PASSWORD_ROUTE]: Joi.string().uri().required(),
  [EnvironmentVariableNames.DASHBOARD_CHANGE_EMAIL_ROUTE]: Joi.string().uri().required(),

  [EnvironmentVariableNames.MAIN_APP_ORIGIN]: Joi.string().uri().required(),
  [EnvironmentVariableNames.MAIN_APP_RESET_PASSWORD_ROUTE]: Joi.string().uri().required(),
  [EnvironmentVariableNames.MAIN_APP_EMAIL_VERIFICATION_ROUTE]: Joi.string().uri().required(),
  [EnvironmentVariableNames.MAIN_APP_CHANGE_EMAIL_ROUTE]: Joi.string().uri().required(),
  [EnvironmentVariableNames.MAIN_APP_OAUTH_CALLBACK_URL]: Joi.string().uri().required(),

  [EnvironmentVariableNames.BULLMQ_RESET_PASSWORD_QUEUE]: Joi.string().required(),
  [EnvironmentVariableNames.BULLMQ_EMAIL_VERIFICATION_QUEUE]: Joi.string().required(),
  [EnvironmentVariableNames.BULLMQ_SET_FIRST_PASSWORD_QUEUE]: Joi.string().required(),
  [EnvironmentVariableNames.BULLMQ_CHANGE_EMAIL_QUEUE]: Joi.string().required(),
  [EnvironmentVariableNames.BULLMQ_PASSWORD_CHANGED_QUEUE]: Joi.string().required(),
  [EnvironmentVariableNames.BULLMQ_WELCOME_QUEUE]: Joi.string().required(),

  [EnvironmentVariableNames.AWS_S3_BUCKET]: Joi.string().required(),
  [EnvironmentVariableNames.AWS_S3_REGION]: Joi.string().required(),
  [EnvironmentVariableNames.AWS_S3_ACCESS_KEY_ID]: Joi.string().required(),
  [EnvironmentVariableNames.AWS_S3_SECRET_ACCESS_KEY]: Joi.string().required(),

  [EnvironmentVariableNames.STORAGE_IMAGE_PROFILE_IMAGES_DIR]: Joi.string().required(),
  [EnvironmentVariableNames.STORAGE_IMAGE_PROFILE_IMAGES_MAX_SIZE]: Joi.number().required(),

  [EnvironmentVariableNames.GOOGLE_OAUTH_CLIENT_ID]: Joi.string().required(),
  [EnvironmentVariableNames.GOOGLE_OAUTH_CLIENT_SECRET]: Joi.string().required(),
  [EnvironmentVariableNames.GOOGLE_OAUTH_CALLBACK_URL]: Joi.string().uri().required(),
  [EnvironmentVariableNames.GOOGLE_OAUTH_SCOPE]: Joi.string().required(),
});
