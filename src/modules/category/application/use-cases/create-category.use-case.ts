import { Inject, Injectable } from "@nestjs/common";
import { CATEGORY_REPOSITORY } from "../constants/category-repository.constant";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { CATEGORY_TRANSLATION_REPOSITORY } from "../constants/category-translation-repository.constant";
import { ICategoryTranslationRepository } from "../interfaces/category-translation-repository.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { CategoryInput } from "../inputs/category.input";
import { CategoryModel } from "../../domain/models/category.model";
import { CategoryTranslationInput } from "../inputs/category-translation.input";
import { CategoryTranslationModel } from "../../domain/models/category-translation.model";
import { CategoryValidatorService } from "../services/category-validator.service";
import { CategoryWithTranslationsViewModel } from "../view-models/category-with-translations.view-model";

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    private readonly categoryValidatorService: CategoryValidatorService,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    @Inject(CATEGORY_TRANSLATION_REPOSITORY) private readonly categoryTranslationRepository: ICategoryTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async createCategory(input: CategoryInput, manager?: unknown): Promise<CategoryModel> {
    const category = new CategoryModel({
      type: input.type,
      parentId: input.parentId,
    });
    return this.categoryRepository.save(category, manager);
  }

  private async createCategoryTranslation(input: CategoryTranslationInput[], category: CategoryModel, manager?: unknown): Promise<CategoryTranslationModel[]> {
    const categoryTranslation = input.map(translation => new CategoryTranslationModel({
      language: translation.language,
      name: translation.name,
      description: translation.description,
      categoryId: category.id,
    }));
    return this.categoryTranslationRepository.saveMany(categoryTranslation, manager);
  }

  private async create(input: CategoryInput): Promise<CategoryWithTranslationsViewModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const category = await this.createCategory(input, manager);
      const categoryTranslation = await this.createCategoryTranslation(input.translations, category, manager);
      return {
        category,
        translations: categoryTranslation,
      };
    });
  }

  async execute(input: CategoryInput): Promise<CategoryWithTranslationsViewModel> {
    await this.categoryValidatorService.validate(input);
    // TODO: Analyze if we need to cache the category and translations
    return this.create(input);
  }
} 