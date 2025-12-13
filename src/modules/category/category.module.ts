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
import { GetAllCategoriesPaginatedWithCountUseCase } from './application/use-cases/get-all-categories-paginated-with-count.use-case';
import { CategoryFinderService } from './application/services/category-finder.service';
import { GetCategoryWithTranslationsByIdUseCase } from './application/use-cases/get-category-with-translations-by-id.use-case';
import { GetCategoryTranslationsByLanguageUseCase } from './application/use-cases/get-category-translations-by-language.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';

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
    CategoryFinderService,
    GetAllCategoriesPaginatedWithCountUseCase,
    CreateCategoryUseCase,
    GetCategoryWithTranslationsByIdUseCase,
    GetCategoryTranslationsByLanguageUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
})
export class CategoryModule {}