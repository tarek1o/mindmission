import { Inject, Injectable } from "@nestjs/common";
import { PERMISSION_TRANSLATION_REPOSITORY } from "../constants/permission-translation-repository.constant";
import { IPermissionTranslationRepository } from "../interfaces/permission-translation-repository.interface";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { GetPermissionTranslationByLanguageViewModel } from "../view-models/get-permission-translation-by-language.view-model";

@Injectable()
export class GetPermissionTranslationsByLanguageUseCase {
  constructor(
    @Inject(PERMISSION_TRANSLATION_REPOSITORY) private readonly translationRepository: IPermissionTranslationRepository,
  ) {}

  execute(language: LanguageEnum): Promise<GetPermissionTranslationByLanguageViewModel[]> {
    return this.translationRepository.getByLanguage(language);
  }
}
