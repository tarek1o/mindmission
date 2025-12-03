import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ICategoryTranslationRepository } from "src/modules/category/application/interfaces/category-translation-repository.interface";
import { CategoryTranslationEntity } from "../entities/category-translation.entity";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { CategoryTranslationModel } from "src/modules/category/domain/models/category-translation.model";
import { CategoryTranslationMapper } from "../mappers/category-translation.mapper";
import { SlugifyHelper } from "src/modules/shared/infrastructure/helpers/slugify.helper";
import { GetCategoryTranslationByNameViewModel } from "src/modules/category/application/view-models/get-category-translation-by-name.view-model";
import { CategoryTypeEnum } from "src/modules/category/domain/enums/category-type.enum";

@Injectable()
export class CategoryTranslationRepository implements ICategoryTranslationRepository {
  constructor(
    @InjectRepository(CategoryTranslationEntity) private readonly categoryTranslationRepository: Repository<CategoryTranslationEntity>,
  ) {}

  async getByLanguage(language: LanguageEnum): Promise<CategoryTranslationModel[]> {
    const entities = await this.categoryTranslationRepository.findBy({ language });
    return entities.map(CategoryTranslationMapper.toModel);
  }

  async getByNameAndLanguageAndTypeExcludingCategoryId(type: CategoryTypeEnum, translations: {language: LanguageEnum, name: string}[], categoryId?: number): Promise<GetCategoryTranslationByNameViewModel[]> {
    const qb = this.categoryTranslationRepository.createQueryBuilder('translations')
    translations.forEach(({ name, language }, index) => {
      const condition = `(
        translations.slug = :slug${index}
        AND 
        translations.language = :language${index}
        AND
        ${categoryId ? 'translations.categoryId != :categoryId' : '1=1'}
      )`;
      qb.orWhere(condition, {
        [`slug${index}`]: SlugifyHelper.slugify(name),
        [`language${index}`]: language,
        categoryId,
      });
    });

    const categoryTranslationEntities = await qb.select([
      'translations.language',
      'translations.name',
    ]).getMany();

    return categoryTranslationEntities.map(({ language, name }) => ({ language, name }));
  }

  async saveMany(translations: CategoryTranslationModel[], manager?: EntityManager): Promise<CategoryTranslationModel[]> {
    const entities = translations.map(CategoryTranslationMapper.toEntity);
    const categoryTranslationRepository = manager?.getRepository(CategoryTranslationEntity) ?? this.categoryTranslationRepository;
    const savedEntities = await categoryTranslationRepository.save(entities);
    return savedEntities.map(CategoryTranslationMapper.toModel);
  }

  async deleteMany(translations: CategoryTranslationModel[], manager?: EntityManager): Promise<void> {
    const entities = translations.map(CategoryTranslationMapper.toEntity);
    const categoryTranslationRepository = manager?.getRepository(CategoryTranslationEntity) ?? this.categoryTranslationRepository;
    await categoryTranslationRepository.delete(entities);
  }
}