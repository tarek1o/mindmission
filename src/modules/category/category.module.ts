import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './infrastructure/database/entities/category.entity';
import { CategoryTranslationEntity } from './infrastructure/database/entities/category-translation.entity';
import { CategoryRepository } from './infrastructure/database/repositories/category.repository';
import { CATEGORY_REPOSITORY } from './application/constants/category-repository.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, CategoryTranslationEntity]),
  ],
  providers: [
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryRepository,
    },
  ],
})
export class CategoryModule {}