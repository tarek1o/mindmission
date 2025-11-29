import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './presentation/rest/controllers/role.controller';
import { RoleResolver } from './presentation/graphql/resolvers/role.resolver';
import { RoleEntity } from './infrastructure/database/entities/role.entity';
import { RoleTranslationEntity } from './infrastructure/database/entities/role-translation.entity';
import { GetAllRolesPaginatedWithCountUseCase } from './application/use-cases/get-all-roles-paginated-with-count.use-case';
import { GetRoleWithTranslationsByIdUseCase } from './application/use-cases/get-role-with-translations-by-id.use-case';
import { GetRoleTranslationsByLanguageUseCase } from './application/use-cases/get-role-translations-by-language.use-case';
import { RoleValidationService } from './application/services/role-validation.service';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from './application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from './application/use-cases/delete-role.use-case';
import { ROLE_REPOSITORY } from './application/constants/role-repository.constant';
import { RoleRepository } from './infrastructure/database/repositories/role.repository';
import { ROLE_TRANSLATION_REPOSITORY } from './application/constants/role-translation-repository.constant';
import { RoleTranslationRepository } from './infrastructure/database/repositories/role-translation.repository';
import { ROLE_CACHE } from './application/constants/role-cache.constant';
import { RoleCacheService } from './infrastructure/cache/services/role.cache.service';
import { PermissionModule } from '../permission/permission.module';
import { RoleFinderService } from './application/services/role-finder.service';
import { AuthMiddleware } from '../shared/presentation/middlewares/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, RoleTranslationEntity]),
    PermissionModule,
  ],
  controllers: [
    RoleController,
  ],
  providers: [
    {
      provide: ROLE_REPOSITORY,
      useClass: RoleRepository
    },
    {
      provide: ROLE_TRANSLATION_REPOSITORY,
      useClass: RoleTranslationRepository
    },
    {
      provide: ROLE_CACHE,
      useClass: RoleCacheService
    },
    RoleFinderService,
    GetAllRolesPaginatedWithCountUseCase,
    GetRoleWithTranslationsByIdUseCase,
    GetRoleTranslationsByLanguageUseCase,
    RoleValidationService,
    CreateRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    RoleResolver,
  ],
  exports: [
    ROLE_REPOSITORY,
    ROLE_CACHE,
  ]
})
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RoleController);
  }
}
