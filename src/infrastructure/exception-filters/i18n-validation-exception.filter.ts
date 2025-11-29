import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { GqlContextType } from "@nestjs/graphql";
import { I18nValidationException } from "nestjs-i18n";
import { I18nValidationRestfulExceptionFilter } from "./rest/i18n-validation-restful-exception.filter";
import { I18nValidationGraphqlExceptionFilter } from "./graphql/i18n-validation-graphql-exception.filter";

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  private readonly exceptionHandlerMap: Record<GqlContextType, string> = {
    graphql: I18nValidationGraphqlExceptionFilter.name,
    http: I18nValidationRestfulExceptionFilter.name,
    ws: undefined,
    rpc: undefined,
  };
  
  constructor(private readonly moduleRef: ModuleRef) {}

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const type: GqlContextType = host.getType();
    const exceptionHandlerName = this.exceptionHandlerMap[type];
    if (exceptionHandlerName) {
      const exceptionHandler = this.moduleRef.get<ExceptionFilter>(exceptionHandlerName, { strict: false });
      return exceptionHandler.catch(exception, host);
    }
  }
}