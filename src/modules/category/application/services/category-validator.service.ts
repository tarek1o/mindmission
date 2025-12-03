import { Inject, Injectable } from "@nestjs/common";
import { CATEGORY_REPOSITORY } from "../constants/category-repository.constant";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { CATEGORY_TRANSLATION_REPOSITORY } from "../constants/category-translation-repository.constant";
import { ICategoryTranslationRepository } from "../interfaces/category-translation-repository.interface";
import { CategoryTypeEnum } from "../../domain/enums/category-type.enum";
import { InvalidInputError } from "src/modules/shared/domain/errors/invalid-input.error";
import { CategoryModel } from "../../domain/models/category.model";
import { CATEGORY_PARENT_MAP } from "../../domain/constants/category-parent-map.constant";
import { CategoryTranslationInput } from "../inputs/category-translation.input";
import { ConflictError } from "src/modules/shared/domain/errors/conflict.error";
import { CategoryInput } from "../inputs/category.input";
import { GetCategoryTranslationByNameViewModel } from "../view-models/get-category-translation-by-name.view-model";

@Injectable()
export class CategoryValidatorService {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    @Inject(CATEGORY_TRANSLATION_REPOSITORY) private readonly categoryTranslationRepository: ICategoryTranslationRepository
  ) {}

  private checkParentExists(childType: CategoryTypeEnum, parent: CategoryModel | null): void {
    if (!parent) {
      throw new InvalidInputError('category.parent_id.required', { type: childType, parent: CATEGORY_PARENT_MAP[childType] });
    }
  }

  private checkParentType(childType: CategoryTypeEnum, parent: CategoryModel): void {
    const parentType = CATEGORY_PARENT_MAP[childType];
    if (parent.type !== parentType) {
      const errorCode = parentType ? 'category.parent_id.required' : 'category.parent_id.not_allowed';
      throw new InvalidInputError(errorCode, { type: childType, parent: parentType });
    }
  }

  private async validateParentId(childType: CategoryTypeEnum, parentId?: number | null): Promise<void> {
    if (parentId) {
      const parent = await this.categoryRepository.getById(parentId);
      this.checkParentExists(childType, parent);
      this.checkParentType(childType, parent);
    }
  }

  private checkDuplicateNames(duplicates: GetCategoryTranslationByNameViewModel[]): void {
    if (duplicates.length) {
      const repeatedNames = Array.from(duplicates.map(({ name }) => `'${name}'`));
      const errorCode = `category.translations.name.${repeatedNames.length > 1 ? 'multi_duplicate' : 'single_duplicate'}`;
      throw new ConflictError(errorCode, { duplicate: repeatedNames.join(', ') });
    }
  }

  private async validateDuplicateNames(type: CategoryTypeEnum, categoryTranslationsProps: CategoryTranslationInput[], categoryId?: number): Promise<void> {
    const parameters = categoryTranslationsProps.map(({ language, name }) => ({ language, name }));
    const categoryTranslations = await this.categoryTranslationRepository.getByNameAndLanguageAndTypeExcludingCategoryId(type, parameters, categoryId);
    this.checkDuplicateNames(categoryTranslations);
  }

  async validate(input: CategoryInput, categoryId?: number): Promise<void> {
    await this.validateParentId(input.type, input.parentId);
    await this.validateDuplicateNames(input.type, input.translations, categoryId);
  }
}