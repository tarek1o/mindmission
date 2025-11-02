import { ArgumentsHost, ExceptionFilter, HttpStatus, Inject, LoggerService } from "@nestjs/common";
import { Response } from "express";
import { BaseExceptionFilter } from "./base/base-exception.filter";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";

export class AllExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_SERVICE) private readonly logger: LoggerService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    this.logger.error(`An unexpected error occurred: ${exception}`, AllExceptionFilter.name);
    const error = this.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'An unexpected error occurred');
    response.status(error.status).json(error);
  }
} 