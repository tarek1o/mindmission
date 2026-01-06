import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserSession } from '../interfaces/user-session.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserSession => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    return request.user;
  },
);
