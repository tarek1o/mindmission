import {
  ExceptionFilter,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { TRANSLATION_SERVICE } from 'src/modules/shared/application/constant/translation-service.constant';
import { ITranslationService } from 'src/modules/shared/application/interfaces/translation-service.interface';
import { BaseDomainError } from 'src/modules/shared/domain/errors/base/base-domain.error';
import { InvalidInputError } from 'src/modules/shared/domain/errors/invalid-input.error';
import { ProtectedResourceError } from 'src/modules/shared/domain/errors/protected-resource.error';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';
import { BusinessRuleViolationError } from 'src/modules/shared/domain/errors/business-rule-violation.error';
import { ResourceNotFoundError } from 'src/modules/shared/domain/errors/resource-not-found.error';
import { UnexpectedBehaviorError } from 'src/modules/shared/domain/errors/unexpected-behavior.error';
import { BaseExceptionFilter } from '../base/base-exception.filter';

@Injectable()
export class DomainGraphqlExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  private readonly errorInfoMap: Record<string, { name: string, statusCode: HttpStatus }> = {
    [InvalidInputError.name]: {
      name: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    [BusinessRuleViolationError.name]: {
      name: 'Unprocessable Entity',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    },
    [ProtectedResourceError.name]: {
      name: 'Forbidden',
      statusCode: HttpStatus.FORBIDDEN,
    },
    [ConflictError.name]: {
      name: 'Conflict',
      statusCode: HttpStatus.CONFLICT
    },
    [ResourceNotFoundError.name]: {
      name: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    [UnexpectedBehaviorError.name]: {
      name: 'Internal Server Error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  }

  constructor(
    @Inject(TRANSLATION_SERVICE) private readonly translationService: ITranslationService,
  ) {
    super()
  }

  catch(exception: BaseDomainError, host: GqlArgumentsHost) {
    const { statusCode, name } = this.errorInfoMap[exception.constructor.name] ?? { name: 'Internal Service Error', statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
    const translatedErrorMessage = this.translationService.translate(`errors.${exception.message}`, exception.args);
    const error = this.buildErrorResponse(statusCode, name, translatedErrorMessage);
    return new GraphQLError(
      error.error,
      {
        extensions: error,

      }
    );
  }
}
