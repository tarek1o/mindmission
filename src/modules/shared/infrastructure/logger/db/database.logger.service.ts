import { LoggerService } from '@nestjs/common';

export class DatabaseLoggerService implements LoggerService {
  log(message: any, context?: string) {
    console.log(`[Database] ${message}`, context ? `Context: ${context}` : '');
  }

  error(message: any, context?: string) {
    console.error(
      `[Database] ${message}`,
      context ? `Context: ${context}` : '',
    );
  }

  warn(message: any, context?: string) {
    console.warn(`[Database] ${message}`, context ? `Context: ${context}` : '');
  }

  debug(message: any, context?: string) {
    console.debug(
      `[Database] ${message}`,
      context ? `Context: ${context}` : '',
    );
  }

  verbose(message: any, context?: string) {
    console.log(`[Database] ${message}`, context ? `Context: ${context}` : '');
  }
}
