import { Inject, Injectable } from "@nestjs/common";
import { CategoryValidatorService } from "../services/category-validator.service";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { CategoryModel } from "../../domain/models/category.model";
import { CategoryFinderService } from "../services/category-finder.service";
import { CategoryInput } from "../inputs/category.input";
import { CategoryTranslationModel } from "../../domain/models/category-translation.model";
import { CategoryWithTranslationsViewModel } from "../view-models/category-with-translations.view-model";
import { CategoryTranslationInput } from "../inputs/category-translation.input";
import { CATEGORY_REPOSITORY } from "../constants/category-repository.constant";
import { ICategoryRepository } from "../interfaces/category-repository.interface";
import { ICategoryTranslationRepository } from "../interfaces/category-translation-repository.interface";
import { CATEGORY_TRANSLATION_REPOSITORY } from "../constants/category-translation-repository.constant";

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryFinderService: CategoryFinderService,
    private readonly validationService: CategoryValidatorService,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: ICategoryRepository,
    @Inject(CATEGORY_TRANSLATION_REPOSITORY) private readonly categoryTranslationRepository: ICategoryTranslationRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private upsertTranslations(translations: CategoryTranslationModel[], translationProps: CategoryTranslationInput[]): CategoryTranslationModel[] {
    const updatedTranslations: CategoryTranslationModel[] = [];
    const translationMap = new Map(translations.map((t) => [t.language, t]));
    const categoryId = translations[0].categoryId;
    translationProps.forEach(props => {
      const existingTranslation = translationMap.get(props.language);
      if(existingTranslation) {
        existingTranslation.update(props);
        updatedTranslations.push(existingTranslation);
      } else {
        updatedTranslations.push(new CategoryTranslationModel({
          ...props,
          categoryId,
        }));
      }
    });
    return updatedTranslations;
  }

  private async validate(id: number, translations: CategoryTranslationModel[], input: Partial<CategoryInput>): Promise<void> {
    const validationInput = {
      type: input.type,
      parentId: input.parentId,
      translations: translations.map(t => ({ language: t.language, name: t.name })),
    }
    await this.validationService.validate(validationInput, id);
  }

  private getDeletedTranslations(currentTranslations: CategoryTranslationModel[], newTranslations: CategoryTranslationModel[]): CategoryTranslationModel[] {
    return currentTranslations.filter(t => !newTranslations.some(t2 => t2.language === t.language));
  }

  private async save(category: CategoryModel, translations: CategoryTranslationModel[], deletedTranslations: CategoryTranslationModel[]): Promise<CategoryWithTranslationsViewModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const savedCategory = await this.categoryRepository.save(category, manager);
      const savedTranslations = await this.categoryTranslationRepository.saveMany(translations, manager);
      deletedTranslations.length && await this.categoryTranslationRepository.deleteMany(deletedTranslations, manager);
      return {
        category: savedCategory,
        translations: savedTranslations,
      };
    });
  }

  async execute(id: number, input: Partial<CategoryInput>): Promise<CategoryWithTranslationsViewModel> {
    const { category, translations } = await this.categoryFinderService.getWithTranslationsById(id);
    if (input.type !== undefined || input.parentId !== undefined) {
      category.update({
        type: input.type,
        parentId: input.parentId,
      });
    }
    const translationsModels = input.translations ? this.upsertTranslations(translations, input.translations) : translations;
    await this.validate(id, translationsModels, input);
    const deletedTranslations = input.translations ? this.getDeletedTranslations(translations, translationsModels) : [];
    const categoryWithTranslationsViewModel = await this.save(category, translationsModels, deletedTranslations);
    return categoryWithTranslationsViewModel;
  }
}

