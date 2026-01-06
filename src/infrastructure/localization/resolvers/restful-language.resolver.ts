import { ExecutionContext, Injectable } from '@nestjs/common';
import { I18nResolver } from 'nestjs-i18n';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

@Injectable()
export class RestfulLanguageResolver implements I18nResolver {
  resolve(context: ExecutionContext): LanguageEnum {
    const request = context.switchToHttp().getRequest();
    const language =
      request?.headers['accept-language'] ?? request.headers['Accept-Language'];
    if (!language || !Object.values(LanguageEnum).includes(language)) {
      request.headers['accept-language'] = LanguageEnum.ENGLISH;
      request.headers['Accept-Language'] = LanguageEnum.ENGLISH;
    }
    return (
      request.headers['accept-language'] ?? request.headers['Accept-Language']
    );
  }
}
