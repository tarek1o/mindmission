import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_TRANSLATION_REPOSITORY } from '../constants/category-translation-repository.constant';
import { ICategoryTranslationRepository } from '../interfaces/category-translation-repository.interface';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { GetCategoryTranslationByLanguageViewModel } from '../view-models/get-category-translation-by-language.view-model';

@Injectable()
export class GetCategoryTranslationsByLanguageUseCase {
  constructor(
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
  ) {}

  execute(
    language: LanguageEnum,
  ): Promise<GetCategoryTranslationByLanguageViewModel[]> {
    return this.categoryTranslationRepository.getByLanguage(language);
  }
}
