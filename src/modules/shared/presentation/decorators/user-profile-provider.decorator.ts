import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ProviderProfileInput } from "../../../auth/application/inputs/provider-profile.input";

export const UserProfileProvider = createParamDecorator((_data: unknown, ctx: ExecutionContext): ProviderProfileInput => {
    const gqlCtx = GqlExecutionContext.create(ctx);
    const request = gqlCtx.getContext().req;
    return request.user;
  },
);