import { Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { BaseExceptionFilter } from '../base/base-exception.filter';

@Catch(GraphQLError)
export class GraphqlExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: GraphQLError, host: GqlArgumentsHost) {
    return new GraphQLError(
      exception.message,
      {
        extensions: {
          code: exception.name,
        }
      }
    );
  }
}