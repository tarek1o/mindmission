import { Module } from '@nestjs/common';
import { WinstonLoggerModule } from './winston/winston.module';
import { DatabaseLoggerModule } from './database-logger/database-logger.module';

@Module({
  imports: [
    WinstonLoggerModule,
    DatabaseLoggerModule
  ]
})
export class LoggerModule {}
