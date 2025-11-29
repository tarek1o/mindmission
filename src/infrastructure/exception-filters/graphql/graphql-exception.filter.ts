import {
  Catch,
  ExceptionFilter,
  Inject,
} from '@nestjs/common';
import { BaseExceptionFilter } from '../base/base-exception.filter';
import { GraphQLError } from 'graphql';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { LoggerService } from '@nestjs/common';

@Catch(GraphQLError)
export class GraphqlExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {
    super();
  } 

  catch(exception: GraphQLError, host: GqlArgumentsHost) {
   this.logger.error(`GraphQL error occurred: ${exception}`, GraphqlExceptionFilter.name);
    return new GraphQLError(
      exception.message,
      {
        extensions: exception.extensions
      }
    );
  }
}