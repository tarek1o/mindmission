import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import {
  I18nValidationError,
  I18nValidationException,
  I18nValidationExceptionFilter as BaseFilter,
} from 'nestjs-i18n';
import { BaseExceptionFilter } from '../base/base-exception.filter';

@Injectable()
@Catch(I18nValidationException)
export class I18nValidationRestfulExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly baseFilter = new BaseFilter({
    responseBodyFormatter: this.responseBodyFormatter.bind(this),
  });

  catch(exception: I18nValidationException, host: ArgumentsHost) {
    return this.baseFilter.catch(exception, host);
  }

  private responseBodyFormatter(
    _host: ArgumentsHost,
    exception: I18nValidationException,
  ) {
    const messages = this.extractValidationErrors(exception.errors);
    return this.buildErrorResponse(
      exception.getStatus(),
      exception.getResponse().toString(),
      messages,
    );
  }

  private extractValidationErrors(errors: I18nValidationError[]): string[] {
    return errors
      .map((error) => {
        const parentErrors = Object.values(error.constraints);
        const childrenErrors = this.extractValidationErrors(error.children);
        return [...parentErrors, ...childrenErrors];
      })
      .flat();
  }
}
