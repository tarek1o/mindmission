import { ServiceUnavailableException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { EnvironmentEnum } from '../configuration/enums/environments.enum';
import { AppConfigInterface } from '../configuration/interfaces/sub-interfaces/app-config.interface';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentConfiguration } from '../configuration/interfaces/config.interface';
import { UILinks } from '../configuration/interfaces/sub-interfaces/ui-links.interface';

type Callback = (err: Error | null, allow?: boolean) => void;

export abstract class CorsConfiguration {
  private static configService: ConfigService<IEnvironmentConfiguration>;

  private static getAllowedOrigins(): string[] {
    const uiLinks = CorsConfiguration.configService.get<UILinks>('uiLinks');
    return Object.values(uiLinks).map((link) => link.origin);
  }

  private static isAllowedOrigin(currentOrigin?: string): boolean {
    const { mode } =
      CorsConfiguration.configService.get<AppConfigInterface>('appConfig');
    const allowedOrigins = CorsConfiguration.getAllowedOrigins();
    return (
      mode === EnvironmentEnum.DEVELOPMENT ||
      allowedOrigins.some((origin) => currentOrigin?.startsWith(origin))
    );
  }

  private static validateCurrentOrigin(
    currentOrigin: string,
    callback: Callback,
  ): void {
    const isAllowed = CorsConfiguration.isAllowedOrigin(currentOrigin);
    const error = isAllowed
      ? null
      : new ServiceUnavailableException('Not allowed by CORS');
    return callback(error, isAllowed);
  }

  static getCorsOptions(
    configService: ConfigService<IEnvironmentConfiguration>,
  ): CorsOptions {
    CorsConfiguration.configService = configService;
    return {
      origin: (currentOrigin, callback) =>
        CorsConfiguration.validateCurrentOrigin(currentOrigin, callback),
    };
  }
}
