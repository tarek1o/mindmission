import { LanguageEnum } from "../../../shared/domain/enums/language.enum";
import { CategoryTypeEnum } from "../../domain/enums/category-type.enum";
import { CategoryTranslationModel } from "../../domain/models/category-translation.model";

export interface ICategoryTranslationRepository {
  getByLanguage(language: LanguageEnum): Promise<any[]>;
  getByNameAndLanguageAndTypeExcludingCategoryId(type: CategoryTypeEnum, translations: {language: LanguageEnum, name: string}[], categoryId?: number): Promise<any[]>;
  saveMany(translations: CategoryTranslationModel[], manager?: unknown): Promise<CategoryTranslationModel[]>;
  deleteMany(translations: CategoryTranslationModel[], manager?: unknown): Promise<void>;
}