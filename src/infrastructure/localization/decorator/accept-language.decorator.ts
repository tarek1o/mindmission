import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export const AcceptLanguage = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): LanguageEnum => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    return (
      request.headers['accept-language'] ?? request.headers['Accept-Language']
    );
  },
);
