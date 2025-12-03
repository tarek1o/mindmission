import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionController } from './presentation/rest/controllers/permission.controller';
import { PermissionEntity } from './infrastructure/database/entities/permission.entity';
import { PermissionTranslationEntity } from './infrastructure/database/entities/permission-translation.entity';
import { GetAllPermissionsPaginatedWithCountUseCase } from './application/use-cases/get-all-permissions-paginated-with-count.use-case';
import { GetPermissionWithTranslationsByIdUseCase } from './application/use-cases/get-permission-with-translations-by-id.use-case';
import { GetPermissionTranslationsByLanguageUseCase } from './application/use-cases/get-permission-translations-by-language.use-case';
import { PermissionValidationService } from './application/services/permission-validation.service';
import { CreatePermissionUseCase } from './application/use-cases/create-permission.use-case';
import { UpdatePermissionUseCase } from './application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from './application/use-cases/delete-permission.use-case';
import { PERMISSION_REPOSITORY } from './application/constants/permission-repository.constant';
import { PermissionRepository } from './infrastructure/database/repositories/permission.repository';
import { PERMISSION_TRANSLATION_REPOSITORY } from './application/constants/permission-translation-repository.constant';
import { PermissionTranslationRepository } from './infrastructure/database/repositories/permission-translation.repository';
import { PERMISSION_CACHE } from './application/constants/permission-cache.constant';
import { PermissionCacheService } from './infrastructure/cache/services/permission.cache.service';
import { PermissionFinderService } from './application/services/permission-finder.service';
import { PermissionResolver } from './presentation/graphql/resolvers/permission.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity, PermissionTranslationEntity]),
  ],
  controllers: [
    PermissionController,
  ],
  providers: [
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionRepository,
    },
    {
      provide: PERMISSION_TRANSLATION_REPOSITORY,
      useClass: PermissionTranslationRepository,
    },
    {
      provide: PERMISSION_CACHE,
      useClass: PermissionCacheService,
    },
    PermissionFinderService,
    GetAllPermissionsPaginatedWithCountUseCase,
    GetPermissionWithTranslationsByIdUseCase,
    GetPermissionTranslationsByLanguageUseCase,
    PermissionValidationService,
    CreatePermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
    PermissionResolver,
  ],
  exports: [
    PERMISSION_REPOSITORY,
    PERMISSION_CACHE,
  ]
})
export class PermissionModule {}
