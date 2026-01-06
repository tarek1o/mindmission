import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../constants/category-repository.constant';
import { CategoryFinderService } from '../services/category-finder.service';
import { ICategoryRepository } from '../interfaces/category-repository.interface';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { CategoryModel } from '../../domain/models/category.model';
import { CategoryTranslationModel } from '../../domain/models/category-translation.model';
import { CATEGORY_TRANSLATION_REPOSITORY } from '../constants/category-translation-repository.constant';
import { ICategoryTranslationRepository } from '../interfaces/category-translation-repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    private readonly categoryFinderService: CategoryFinderService,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
    @Inject(CATEGORY_TRANSLATION_REPOSITORY)
    private readonly categoryTranslationRepository: ICategoryTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private save(
    category: CategoryModel,
    translations: CategoryTranslationModel[],
  ): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.categoryRepository.save(category, manager);
      await this.categoryTranslationRepository.saveMany(translations, manager);
    });
  }

  async execute(id: number): Promise<void> {
    const { category, translations } =
      await this.categoryFinderService.getWithTranslationsById(id);
    category.markAsDeleted();
    translations.forEach((translation) => translation.markAsDeleted());
    await this.save(category, translations);
  }
}
