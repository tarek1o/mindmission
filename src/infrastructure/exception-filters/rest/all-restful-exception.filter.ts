import { ArgumentsHost, ExceptionFilter, HttpStatus, Injectable } from "@nestjs/common";
import { BaseExceptionFilter } from "../base/base-exception.filter";
import { Response } from "express";

@Injectable()
export class AllRestfulExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const error = this.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'An unexpected error occurred');
    response.status(error.status).json(error);
  }
} 