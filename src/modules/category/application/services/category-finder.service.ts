import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../constants/category-repository.constant';
import { ICategoryRepository } from '../interfaces/category-repository.interface';
import { CategoryWithTranslationsViewModel } from '../view-models/category-with-translations.view-model';
import { ResourceNotFoundError } from 'src/modules/shared/domain/errors/resource-not-found.error';

@Injectable()
export class CategoryFinderService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getWithTranslationsById(
    id: number,
  ): Promise<CategoryWithTranslationsViewModel> {
    const categoryWithTranslationsViewModel =
      await this.categoryRepository.getByIdWithTranslations(id);
    if (!categoryWithTranslationsViewModel) {
      throw new ResourceNotFoundError('category.not_found', { id });
    }
    return categoryWithTranslationsViewModel;
  }
}
