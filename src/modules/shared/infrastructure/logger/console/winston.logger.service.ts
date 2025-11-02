import { Inject, Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  log(message: any, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: any, context?: string) {
    this.logger.error(message, { context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, { context });
  }

  fatal(message: any, context?: string) {
    this.logger.log('fatal', message, { context });
  }

  setLogLevels(levels: LogLevel[]) {
    this.logger.configure({
      level: levels.join(','),
    });
  }
}
