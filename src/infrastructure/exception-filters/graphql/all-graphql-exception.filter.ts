import { ExceptionFilter, HttpStatus, Injectable } from "@nestjs/common";
import { GqlArgumentsHost } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { BaseExceptionFilter } from "../base/base-exception.filter";

@Injectable()
export class AllGraphqlExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: GqlArgumentsHost) {
    const error = this.buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'An unexpected error occurred');
    throw new GraphQLError(error.messages.join(', '), {
      extensions: error
    });
  }
}