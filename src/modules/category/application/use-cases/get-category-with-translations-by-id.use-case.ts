import { Injectable } from '@nestjs/common';
import { CategoryFinderService } from '../services/category-finder.service';
import { CategoryWithTranslationsViewModel } from '../view-models/category-with-translations.view-model';

@Injectable()
export class GetCategoryWithTranslationsByIdUseCase {
  constructor(private readonly categoryFinderService: CategoryFinderService) {}

  execute(id: number): Promise<CategoryWithTranslationsViewModel> {
    return this.categoryFinderService.getWithTranslationsById(id);
  }
}
