import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/database/entities/user.entity';
import { USER_REPOSITORY } from './application/constants/user-repository.constant';
import { UserRepository } from './infrastructure/database/repositories/user.repository';
import { UserController } from './presentation/controllers/user.controller';
import { GetAllUsersPaginatedWithCountUseCase } from './application/use-cases/get-all-users-paginated-with-count.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { CreateAdminUseCase } from './application/use-cases/create-admin.use.case';
import { UpdateMainUserInfoUseCase } from './application/use-cases/update-main-user-info.use-case';
import { RoleModule } from '../role/role.module';
import { UserValidatorService } from './application/services/user-validator.service';
import { UpdateUserRolesUseCase } from './application/use-cases/update-user-roles.use-case';
import { ChangeEmailUseCase } from './application/use-cases/change-email.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { ToggleBlockUserUseCase } from './application/use-cases/toggle-block-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { ActionTokenModule } from '../action-token/action-token.module';
import { UserFinderService } from './application/services/user-finder.service';
import { USER_PROFILE_CHANGE_REPOSITORY } from './application/constants/user-profile-change-repository.constant';
import { UserProfileChangeRepository } from './infrastructure/database/repositories/user-profile-change.repository';
import { UserProfileChangeEntity } from './infrastructure/database/entities/user-profile-change.entity';
import { CompleteChangeEmailUseCase } from './application/use-cases/complete-change.email.use-case';
import { ForceLogoutService } from './application/services/force-logout.service';
import { AuthMiddleware } from '../shared/presentation/middlewares/auth.middleware';
import { NotificationModule } from '../notification/notification.module';
import { StorageModule } from '../storage/storage.module';
import { SetFirstPasswordNotificationProcessor } from './infrastructure/bullmq/processors/set-first-password-notification.processor';
import { PasswordChangedNotificationProcessor } from './infrastructure/bullmq/processors/password-changed-notification.processor';
import { ChangeEmailNotificationProcessor } from './infrastructure/bullmq/processors/change-email-notification.processor';
import { ProfileController } from './presentation/controllers/profile.controller';
import { ChangeProfileImageUseCase } from './application/use-cases/change-profile-image.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserProfileChangeEntity]),
    RoleModule,
    ActionTokenModule,
    NotificationModule,
    StorageModule,
  ],
  controllers: [UserController, ProfileController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_PROFILE_CHANGE_REPOSITORY,
      useClass: UserProfileChangeRepository,
    },
    GetAllUsersPaginatedWithCountUseCase,
    GetUserByIdUseCase,
    GetUserProfileUseCase,
    CreateAdminUseCase,
    UserValidatorService,
    UserFinderService,
    ForceLogoutService,
    UpdateMainUserInfoUseCase,
    UpdateUserRolesUseCase,
    ChangeEmailUseCase,
    CompleteChangeEmailUseCase,
    ChangePasswordUseCase,
    ChangeProfileImageUseCase,
    ToggleBlockUserUseCase,
    DeleteUserUseCase,
    SetFirstPasswordNotificationProcessor,
    ChangeEmailNotificationProcessor,
    PasswordChangedNotificationProcessor,
  ],
  exports: [USER_REPOSITORY, UserValidatorService, UserFinderService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController);
    consumer.apply(AuthMiddleware).forRoutes(ProfileController);
  }
}
