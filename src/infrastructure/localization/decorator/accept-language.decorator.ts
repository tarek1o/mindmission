import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AcceptLanguage = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.headers['accept-language'] ?? request.headers['Accept-Language']
    );
  },
);
