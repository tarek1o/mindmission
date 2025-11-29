import { registerAs } from '@nestjs/config';
import { DurationInputArg2 } from 'moment';
import { IEnvironmentConfiguration } from '../interfaces/config.interface';
import { EnvironmentEnum } from '../enums/environments.enum';
import { EnvironmentVariableNames } from '../constant/environment-variable-names';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { TokenDurationLifeTime } from '../interfaces/sub-interfaces/action-token-config.interface';
import { expirationDatePattern } from '../validation/validation.config';
import { NotificationChannelEnum } from 'src/modules/notification/domain/enums/notification-channel.enum';

function splitDuration(key: string): TokenDurationLifeTime {
  const duration = process.env[key];
  const match = duration.match(expirationDatePattern);
  const [, value, unit] = match ?? [];
  return {
    value: +value, 
    unit: unit as DurationInputArg2,
  }
}

export const configuration = registerAs('', (): IEnvironmentConfiguration => {
  return {
    appConfig: {
      name: process.env[EnvironmentVariableNames.APP_NAME],
      port: parseInt(process.env[EnvironmentVariableNames.PORT], 10),
      mode: process.env[EnvironmentVariableNames.NODE_ENV] as EnvironmentEnum,
      graphql: {
        path: process.env[EnvironmentVariableNames.GRAPHQL_PATH].trim(),
        sortSchema: process.env[EnvironmentVariableNames.GRAPHQL_SORT_SCHEMA].trim().toLowerCase() === 'true',
        introspection: process.env[EnvironmentVariableNames.GRAPHQL_INTROSPECTION].trim().toLowerCase() === 'true',
      },
    },
    bullMQ: {
      queues: {
        resetPasswordQueue: process.env[EnvironmentVariableNames.BULLMQ_RESET_PASSWORD_QUEUE],
        emailVerificationQueue: process.env[EnvironmentVariableNames.BULLMQ_EMAIL_VERIFICATION_QUEUE],
        setFirstPasswordQueue: process.env[EnvironmentVariableNames.BULLMQ_SET_FIRST_PASSWORD_QUEUE],
        changeEmailQueue: process.env[EnvironmentVariableNames.BULLMQ_CHANGE_EMAIL_QUEUE],
        passwordChangedQueue: process.env[EnvironmentVariableNames.BULLMQ_PASSWORD_CHANGED_QUEUE],
        welcomeQueue: process.env[EnvironmentVariableNames.BULLMQ_WELCOME_QUEUE],
      },
    },
    settings: {
      notifications: {
        defaultChannel: process.env[EnvironmentVariableNames.NOTIFICATIONS_DEFAULT_CHANNEL] as NotificationChannelEnum,
      },
    },
    rateLimiter: {
      default: {
        limit: parseInt(process.env[EnvironmentVariableNames.RATE_LIMITER_DEFAULT_LIMIT], 10),
        ttl: parseInt(process.env[EnvironmentVariableNames.RATE_LIMITER_DEFAULT_TTL], 10),
      },
      auth: {
        login: {
          limit: parseInt(process.env[EnvironmentVariableNames.LOGIN_RATE_LIMITER_DEFAULT_LIMIT], 10),
          ttl: parseInt(process.env[EnvironmentVariableNames.LOGIN_RATE_LIMITER_DEFAULT_TTL], 10),
        },
        verifySetFirstPasswordToken: {
          limit: parseInt(process.env[EnvironmentVariableNames.VERIFY_SET_FIRST_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT], 10),
          ttl: parseInt(process.env[EnvironmentVariableNames.VERIFY_SET_FIRST_PASSWORD_RATE_LIMITER_DEFAULT_TTL], 10),
        },
        forgetPassword: {
          limit: parseInt(process.env[EnvironmentVariableNames.FORGET_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT], 10),
          ttl: parseInt(process.env[EnvironmentVariableNames.FORGET_PASSWORD_RATE_LIMITER_DEFAULT_TTL], 10),
        },
        verifyResetPasswordToken: {
          limit: parseInt(process.env[EnvironmentVariableNames.VERIFY_RESET_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT], 10),
          ttl: parseInt(process.env[EnvironmentVariableNames.VERIFY_RESET_PASSWORD_RATE_LIMITER_DEFAULT_TTL], 10),
        },
      },
    },
    db: {
      port: parseInt(process.env[EnvironmentVariableNames.DB_PORT], 10),
      host: process.env[EnvironmentVariableNames.DB_HOST],
      name: process.env[EnvironmentVariableNames.DB_NAME],
      username: process.env[EnvironmentVariableNames.DB_USERNAME],
      password: process.env[EnvironmentVariableNames.DB_PASSWORD],
      migrationsPath: process.env[EnvironmentVariableNames.DB_MIGRATIONS],
      entitiesPath: process.env[EnvironmentVariableNames.DB_ENTITIES],
    },
    redis: {
      host: process.env[EnvironmentVariableNames.REDIS_HOST],
      port: parseInt(process.env[EnvironmentVariableNames.REDIS_PORT], 10),
      username: process.env[EnvironmentVariableNames.REDIS_USERNAME],
      password: process.env[EnvironmentVariableNames.REDIS_PASSWORD],
    },
    actionTokens: {
      stateful: {
        [ActionTokenTypeEnum.REFRESH_TOKEN]: splitDuration(EnvironmentVariableNames.REFRESH_TOKEN_EXPIRATION_DURATION),
        [ActionTokenTypeEnum.EMAIL_VERIFICATION_TOKEN]: splitDuration(EnvironmentVariableNames.EMAIL_VERIFICATION_TOKEN_EXPIRATION_DURATION),
        [ActionTokenTypeEnum.RESET_PASSWORD_TOKEN]: splitDuration(EnvironmentVariableNames.RESET_PASSWORD_TOKEN_EXPIRATION_DURATION),
      },
      stateless: {
        [ActionTokenTypeEnum.ACCESS_TOKEN]: {
          secret: process.env[EnvironmentVariableNames.ACCESS_TOKEN_SECRET_KEY],
          expiresIn: splitDuration(EnvironmentVariableNames.ACCESS_TOKEN_EXPIRATION_DURATION),
        },
      }
    },
    emailProvider: {
      host: process.env[EnvironmentVariableNames.EMAIL_PROVIDER_HOST],
      port: parseInt(process.env[EnvironmentVariableNames.EMAIL_PROVIDER_PORT], 10),
      auth: {
        user: process.env[EnvironmentVariableNames.EMAIL_PROVIDER_USERNAME],
        pass: process.env[EnvironmentVariableNames.EMAIL_PROVIDER_PASSWORD],
      }
    },
    uiLinks: {
      dashboard: {
        origin: process.env[EnvironmentVariableNames.DASHBOARD_ORIGIN],
        resetPasswordURL: process.env[EnvironmentVariableNames.DASHBOARD_RESET_PASSWORD_ROUTE],
        setPasswordURL: process.env[EnvironmentVariableNames.DASHBOARD_SET_PASSWORD_ROUTE],
        changeEmailURL: process.env[EnvironmentVariableNames.DASHBOARD_CHANGE_EMAIL_ROUTE]
      },
      mainApp: {
        origin: process.env[EnvironmentVariableNames.MAIN_APP_ORIGIN],
        resetPasswordURL: process.env[EnvironmentVariableNames.MAIN_APP_RESET_PASSWORD_ROUTE],
        emailVerificationURL: process.env[EnvironmentVariableNames.MAIN_APP_EMAIL_VERIFICATION_ROUTE],
        changeEmailURL: process.env[EnvironmentVariableNames.MAIN_APP_CHANGE_EMAIL_ROUTE],
        oauthCallbackURL: process.env[EnvironmentVariableNames.MAIN_APP_OAUTH_CALLBACK_URL],
      },
    },
    awsS3Config: {
      bucket: process.env[EnvironmentVariableNames.AWS_S3_BUCKET],
      region: process.env[EnvironmentVariableNames.AWS_S3_REGION],
      credentials: {
        accessKeyId: process.env[EnvironmentVariableNames.AWS_S3_ACCESS_KEY_ID],
        secretAccessKey: process.env[EnvironmentVariableNames.AWS_S3_SECRET_ACCESS_KEY],
      },
    },
    storage: {
      image: {
        profileImages: {
          dir: process.env[EnvironmentVariableNames.STORAGE_IMAGE_PROFILE_IMAGES_DIR],
          maxSize: parseInt(process.env[EnvironmentVariableNames.STORAGE_IMAGE_PROFILE_IMAGES_MAX_SIZE], 10),
        },
      },
    },
    oauth: {
      google: {
        clientID: process.env[EnvironmentVariableNames.GOOGLE_OAUTH_CLIENT_ID],
        clientSecret: process.env[EnvironmentVariableNames.GOOGLE_OAUTH_CLIENT_SECRET],
        callbackURL: process.env[EnvironmentVariableNames.GOOGLE_OAUTH_CALLBACK_URL],
        scope: process.env[EnvironmentVariableNames.GOOGLE_OAUTH_SCOPE].split(','),
      },
    },
  };
});
