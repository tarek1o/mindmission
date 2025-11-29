import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ICategoryRepository } from "src/modules/category/application/interfaces/category-repository.interface";
import { CategoryEntity } from "../entities/category.entity";
import { CategoryModel } from "src/modules/category/domain/models/category.model";
import { CategoryMapper } from "../mappers/category.mapper";

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getById(id: number): Promise<CategoryModel | null> {
    const entity = await this.categoryRepository.findOneBy({ id });
    return entity ? CategoryMapper.toModel(entity) : null;
  }

  async save(category: CategoryModel, manager?: EntityManager): Promise<CategoryModel> {
    const entity = CategoryMapper.toEntity(category);
    const categoryRepository = manager?.getRepository(CategoryEntity) ?? this.categoryRepository;
    const savedEntity = await categoryRepository.save(entity);
    return CategoryMapper.toModel(savedEntity);
  }
} 