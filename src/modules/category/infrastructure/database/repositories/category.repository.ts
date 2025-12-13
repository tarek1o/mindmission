import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOptionsOrder, Like, Repository } from "typeorm";
import { ICategoryRepository } from "src/modules/category/application/interfaces/category-repository.interface";
import { CategoryEntity } from "../entities/category.entity";
import { CategoryModel } from "src/modules/category/domain/models/category.model";
import { CategoryMapper } from "../mappers/category.mapper";
import { GetAllCategoriesQueryInput } from "src/modules/category/application/inputs/get-all-categories-query.input";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { AllowedCategoryOrderColumnsEnum } from "src/modules/category/application/enums/allowed-category-order-columns.enum";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { SlugifyHelper } from "src/modules/shared/infrastructure/helpers/slugify.helper";
import { GetAllCategoriesByLanguageViewModel } from "src/modules/category/application/view-models/get-all-categories-by-language.view-model";
import { CategoryWithTranslationsViewModel } from "src/modules/category/application/view-models/category-with-translations.view-model";
import { CategoryTranslationMapper } from "../mappers/category-translation.mapper";

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  
  private buildOrderQuery(order: IOrder<AllowedCategoryOrderColumnsEnum>): FindOptionsOrder<CategoryEntity> {
    const orderKeyColumnsMap: Record<AllowedCategoryOrderColumnsEnum, FindOptionsOrder<CategoryEntity>> = {
      [AllowedCategoryOrderColumnsEnum.ID]: {
        id: order.orderDirection,
      },
      [AllowedCategoryOrderColumnsEnum.NAME]: {
        translations: {
          name: order.orderDirection,
        },
      },
      [AllowedCategoryOrderColumnsEnum.CREATED_AT]: {
        createdAt: order.orderDirection,
      },
      [AllowedCategoryOrderColumnsEnum.UPDATED_AT]: {
        updatedAt: order.orderDirection,
      },
    }
    return orderKeyColumnsMap[order.orderBy];
  }

  async getAllPaginatedAndTotalCount(query: GetAllCategoriesQueryInput, order: IOrder<AllowedCategoryOrderColumnsEnum>, pagination: Pagination): Promise<{ models: GetAllCategoriesByLanguageViewModel[]; count: number; }> {
    const { type, language, name } = query;
    const [models, count] = await this.categoryRepository.findAndCount({
      where: {
        type,
        translations: {
          language,
          slug: name ? Like(`%${SlugifyHelper.slugify(name)}%`) : undefined,
        },
      },
      relations: {
        translations: true,
      },
      select: {
        id: true,
        translations: {
          name: true,
          description: true,
        },
        type: true,
        createdAt: true,
        updatedAt: true,
      },
      order: this.buildOrderQuery(order),
      skip: pagination.skip,
      take: pagination.take,
    });
    return { 
      models: models.map(model => this.mapToGetAllCategoriesByLanguageViewModel(model)), 
      count 
    }
  }

  private mapToGetAllCategoriesByLanguageViewModel(entity: CategoryEntity): GetAllCategoriesByLanguageViewModel {
    return {
      id: entity.id,
      name: entity.translations[0].name,
      description: entity.translations[0].description,
      type: entity.type,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  async getById(id: number): Promise<CategoryModel | null> {
    const entity = await this.categoryRepository.findOneBy({ id });
    return entity ? CategoryMapper.toModel(entity) : null;
  }

  async getByIdWithTranslations(id: number): Promise<CategoryWithTranslationsViewModel | null> {
    const categoryEntity = await this.categoryRepository.findOne({ 
      where: { id },
      relations: {
        translations: true,
      },
    });
    return categoryEntity ? {
      category: CategoryMapper.toModel(categoryEntity),
      translations: categoryEntity.translations.map(translation => CategoryTranslationMapper.toModel(translation)),
    } : null;
  }

  async save(category: CategoryModel, manager?: EntityManager): Promise<CategoryModel> {
    const entity = CategoryMapper.toEntity(category);
    const categoryRepository = manager?.getRepository(CategoryEntity) ?? this.categoryRepository;
    const savedEntity = await categoryRepository.save(entity);
    return CategoryMapper.toModel(savedEntity);
  }
} 