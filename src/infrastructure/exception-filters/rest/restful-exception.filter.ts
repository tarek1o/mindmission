import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { isObject } from 'class-validator';
import { BaseExceptionFilter } from '../base/base-exception.filter';

interface ExceptionResponse {
  message: string | string[];
  error: string;
}

@Injectable()
export class RestfulExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {

  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { error: errorName, message } = this.extractMessageFromExceptionResponse(exception);
    const error = this.buildErrorResponse(exception.getStatus(), errorName, message)
    response.status(error.status).json(error);
  }

  private extractMessageFromExceptionResponse(exception: HttpException): ExceptionResponse {
    const exceptionResponse = exception.getResponse();
    const error = isObject(exceptionResponse) ? (Reflect.get(exceptionResponse, 'error') ?? exception.name) : exception.name;
    const message = isObject(exceptionResponse) ? (Reflect.get(exceptionResponse, 'message') ?? exceptionResponse) : exceptionResponse;
    return {
      error,
      message
    }
  }
}