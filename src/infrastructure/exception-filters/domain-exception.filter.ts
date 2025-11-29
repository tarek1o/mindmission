import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { GqlContextType } from '@nestjs/graphql';
import { BaseDomainError } from 'src/modules/shared/domain/errors/base/base-domain.error';
import { DomainGraphqlExceptionFilter } from './graphql/domain-graphql-exception.filter';
import { DomainRestfulExceptionFilter } from './rest/domain-restful-exception.filter';

@Catch(BaseDomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionHandlerMap: Record<GqlContextType, string> = {
    graphql: DomainGraphqlExceptionFilter.name,
    http: DomainRestfulExceptionFilter.name,
    ws: undefined,
    rpc: undefined,
  };
  
  constructor(private readonly moduleRef: ModuleRef) {}

  catch(exception: BaseDomainError, host: ArgumentsHost) {
    const type: GqlContextType = host.getType();
    const exceptionHandlerName = this.exceptionHandlerMap[type];
    if (exceptionHandlerName) {
      const exceptionHandler = this.moduleRef.get<ExceptionFilter>(exceptionHandlerName, { strict: false });
      return exceptionHandler.catch(exception, host);
    }
  }
}
