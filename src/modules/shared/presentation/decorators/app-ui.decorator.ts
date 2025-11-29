import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AppUiEnum } from "../../domain/enums/app-ui.enum";
import { HeadersModel } from "../models/headers.model";

export const AppUi = createParamDecorator((_data: unknown, ctx: ExecutionContext): AppUiEnum => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  const request = gqlCtx.getContext().req;
  return new HeadersModel(request.headers).applicationUi;
});