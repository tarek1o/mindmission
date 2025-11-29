import { Database } from './sub-interfaces/db.interface';
import { IActionTokenConfiguration } from './sub-interfaces/action-token-config.interface';
import { EmailProvider } from './sub-interfaces/email-provider.interface';
import { IRedisConfiguration } from './sub-interfaces/redis.interface';
import { UILinks } from './sub-interfaces/ui-links.interface';
import { AwsS3ConfigInterface } from './sub-interfaces/aws-s3-config.interface';
import { AppConfigInterface } from './sub-interfaces/app-config.interface';
import { RateLimiterConfiguration } from './sub-interfaces/rate-limiter-configuration.interface';
import { SettingsConfiguration } from './sub-interfaces/settings.configuration.interface';
import { BullMQConfigurations } from './sub-interfaces/bull-mq-configurations.interface';
import { StorageConfiguration } from './sub-interfaces/storage-configuration.interface';
import { OAuthConfiguration } from './sub-interfaces/oauth-configuration.interface';

export interface IEnvironmentConfiguration {
  appConfig: AppConfigInterface;
  settings: SettingsConfiguration;
  db: Database;
  redis: IRedisConfiguration;
  actionTokens: IActionTokenConfiguration;
  emailProvider: EmailProvider;
  uiLinks: UILinks;
  awsS3Config: AwsS3ConfigInterface;
  rateLimiter: RateLimiterConfiguration;
  bullMQ: BullMQConfigurations;
  storage: StorageConfiguration;
  oauth: OAuthConfiguration;
}
