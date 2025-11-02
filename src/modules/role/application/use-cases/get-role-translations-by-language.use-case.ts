import { Inject, Injectable } from "@nestjs/common";
import { ROLE_TRANSLATION_REPOSITORY } from "../constants/role-translation-repository.constant";
import { IRoleTranslationRepository } from "../interfaces/role-translation-repository.interface";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { GetRoleTranslationByLanguageViewModel } from "../view-models/get-role-translation-by-language.view-model";

@Injectable()
export class GetRoleTranslationsByLanguageUseCase {
  constructor(
    @Inject(ROLE_TRANSLATION_REPOSITORY) private readonly roleTranslationRepository: IRoleTranslationRepository,
  ) {}

  execute(language: LanguageEnum): Promise<GetRoleTranslationByLanguageViewModel[]> {
    return this.roleTranslationRepository.getByLanguage(language);
  }
}
