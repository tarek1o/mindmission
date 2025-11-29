import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { I18nResolver } from "nestjs-i18n";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";

@Injectable()
export class GraphqlLanguageResolver implements I18nResolver {
  resolve(context: ExecutionContext): LanguageEnum {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;

    const language =
      request.headers['accept-language'] ??
      request.headers['Accept-Language'];

    if (!language || !Object.values(LanguageEnum).includes(language)) {
      request.headers['accept-language'] = LanguageEnum.ENGLISH;
      request.headers['Accept-Language'] = LanguageEnum.ENGLISH;
    }

    return (
      request.headers['accept-language'] ??
      request.headers['Accept-Language']
    );
  }
}