import { Injectable } from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";
import { ITranslationService } from "../../application/interfaces/translation-service.interface";
import { LanguageEnum } from "../../domain/enums/language.enum";

@Injectable()
export class TranslationService implements ITranslationService {
  constructor(private readonly i18nService: I18nService) {}

  translate(key: string, args?: Record<string, any>, lang?: string): string {
    return this.i18nService.translate(key, {
      args,
      lang: lang ?? I18nContext.current()?.lang ?? LanguageEnum.ENGLISH,
    })
  }
}