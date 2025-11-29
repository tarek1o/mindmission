import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GqlContextType } from '@nestjs/graphql';
import { RestfulExceptionFilter } from './rest/restful-exception.filter';

@Catch(HttpException)
export class MainExceptionFilter implements ExceptionFilter {
  private readonly exceptionHandlerMap: Record<GqlContextType, string> = {
    graphql: RestfulExceptionFilter.name,
    http: RestfulExceptionFilter.name,
    ws: undefined,
    rpc: undefined,
  };
  
  constructor(private readonly moduleRef: ModuleRef) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const type: GqlContextType = host.getType();    
    const exceptionHandlerName = this.exceptionHandlerMap[type];
    if (exceptionHandlerName) {
      const exceptionHandler = this.moduleRef.get<ExceptionFilter>(exceptionHandlerName, { strict: false });
      return exceptionHandler.catch(exception, host);
    }
  }
}