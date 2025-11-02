import { ServiceUnavailableException } from '@nestjs/common';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { IEnvironmentConfiguration } from '../configuration/interfaces/config.interface';
import { UILinks } from '../configuration/interfaces/sub-interfaces/ui-links.interface';

type Callback = (err: Error | null, allow?: boolean) => void;

export abstract class CorsConfiguration {
  static getCorsOptions(
    configService: ConfigService<IEnvironmentConfiguration>,
  ): CorsOptions | CorsOptionsDelegate<unknown> {
    return {
      origin: (currentOrigin, callback) => {
        const allowedOrigins = CorsConfiguration.getAllowedOrigins(configService);
        return CorsConfiguration.validateCurrentOrigin(
          allowedOrigins,
          currentOrigin,
          callback,
        );
      },
    };
  }

  private static getAllowedOrigins(
    configService: ConfigService<IEnvironmentConfiguration>,
  ): string[] {
    const uiLinks = configService.get<UILinks>('uiLinks');
    return Object.values(uiLinks).map((link) => link.origin);
  }

  private static validateCurrentOrigin(
    allowedOrigins: string[],
    currentOrigin: string,
    callback: Callback,
  ): void {
    const results = {
      error: null,
      allow: true,
    }
    if (currentOrigin && !allowedOrigins.includes(currentOrigin)) {
      results.error = new ServiceUnavailableException('Not allowed by CORS');
      results.allow = false;
    }
    return callback(results.error, results.allow);
  }
}
