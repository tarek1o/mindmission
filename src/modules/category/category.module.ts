import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './infrastructure/database/entities/category.entity';
import { CategoryTranslationEntity } from './infrastructure/database/entities/category-translation.entity';
import { CategoryRepository } from './infrastructure/database/repositories/category.repository';
import { CATEGORY_REPOSITORY } from './application/constants/category-repository.constant';
import { CategoryValidatorService } from './application/services/category-validator.service';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { CATEGORY_TRANSLATION_REPOSITORY } from './application/constants/category-translation-repository.constant';
import { CategoryTranslationRepository } from './infrastructure/database/repositories/category-translation.repository';
import { CategoryController } from './presentation/rest/controllers/category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, CategoryTranslationEntity]),
  ],
  controllers: [CategoryController],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
    {
      provide: CATEGORY_TRANSLATION_REPOSITORY,
      useClass: CategoryTranslationRepository,
    },
    CategoryValidatorService,
    CreateCategoryUseCase,
  ],
})
export class CategoryModule {}