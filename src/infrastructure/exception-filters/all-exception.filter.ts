import { ArgumentsHost, ExceptionFilter, Inject, LoggerService } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { GqlContextType } from "@nestjs/graphql";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { AllRestfulExceptionFilter } from "./rest/all-restful-exception.filter";
import { AllGraphqlExceptionFilter } from "./graphql/all-graphql-exception.filter";

export class AllExceptionFilter implements ExceptionFilter {
  private readonly exceptionHandlerMap: Record<GqlContextType, string> = {
    graphql: AllGraphqlExceptionFilter.name,
    http: AllRestfulExceptionFilter.name,
    ws: undefined,
    rpc: undefined,
  };
  
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    console.error(exception);
    this.logger.error(`An unexpected error occurred: ${exception}`, AllExceptionFilter.name);
    const type: GqlContextType = host.getType();  
    const exceptionHandlerName = this.exceptionHandlerMap[type];
    if (exceptionHandlerName) {
      const exceptionHandler = this.moduleRef.get<ExceptionFilter>(exceptionHandlerName, { strict: false });
      return exceptionHandler.catch(exception, host);
    }
  }
} 