import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { IEnvironmentConfiguration } from './infrastructure/configuration/interfaces/config.interface';
import { LOGGER_SERVICE } from './modules/shared/application/constant/logger-service.constant';
import { AppConfigInterface } from './infrastructure/configuration/interfaces/sub-interfaces/app-config.interface';
import { CorsConfiguration } from './infrastructure/server/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get<LoggerService>(LOGGER_SERVICE);
  app.useLogger(logger);
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning();
  const configService = app.get(ConfigService<IEnvironmentConfiguration>);
  const corsOptions = CorsConfiguration.getCorsOptions(configService);
  app.enableCors(corsOptions);
  const { port } = configService.get<AppConfigInterface>('appConfig');
  await app.listen(port);
  logger.log(`App is running on port ${port} 🚀`, 'Bootstrap');
}
bootstrap();
