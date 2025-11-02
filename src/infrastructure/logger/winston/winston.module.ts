import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { transports, format } from 'winston';
import { IEnvironmentConfiguration } from 'src/infrastructure/configuration/interfaces/config.interface';
import { AppConfigInterface } from 'src/infrastructure/configuration/interfaces/sub-interfaces/app-config.interface';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<IEnvironmentConfiguration>) => {
        const { name } = configService.get<AppConfigInterface>('appConfig');
        return {
          transports: [
            new transports.Console({
              format: format.combine(
                format.timestamp(),
                format.ms(),
                utilities.format.nestLike(name, {
                  colors: true,
                  prettyPrint: true,
                  processId: true,
                  appName: true,
                }),
              ),
            }),
          ],
        }
      }
    }),
  ]
})
export class WinstonLoggerModule {}
