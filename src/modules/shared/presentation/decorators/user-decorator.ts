import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestWithUser } from "../interfaces/request-with-user.interface";
import { UserSession } from "../interfaces/user-session.interface";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): UserSession => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});