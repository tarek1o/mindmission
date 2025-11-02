import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { PasswordController } from './presentation/controllers/password.controller';
import { SignupUseCase } from './application/use-cases/signup/signup.use-case';
import { CompleteSignupUseCase } from './application/use-cases/signup/complete-sign-up.use-case';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { SuspendedAccountModule } from '../suspended-account/suspended-account.module';
import { VerifySetFirstPasswordTokenUseCase } from './application/use-cases/set-password/verify-set-first-password-token.use-case';
import { SetFirstPasswordUseCase } from './application/use-cases/set-password/set-first-password.use-case';
import { ForgetPasswordUseCase } from './application/use-cases/forget-password/forget-password.use-case';
import { ActionTokenModule } from '../action-token/action-token.module';
import { VerifyResetPasswordTokenUseCase } from './application/use-cases/forget-password/verify-reset-password-token.use-case';
import { ResetPasswordUseCase } from './application/use-cases/forget-password/reset-password.use-case';
import { LogoutUseCase } from './application/use-cases/logout/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token/refresh-token.use-case';
import { ActionTokenVerifierService } from './application/services/action-token-verifier.service';
import { AuthTokenService } from './application/services/auth-token.service';
import { NotificationModule } from '../notification/notification.module';
import { ResetPasswordNotificationProcessor } from './infrastructure/bull-mq/processors/reset-password-notification.processor';
import { WelcomeNotificationProcessor } from './infrastructure/bull-mq/processors/welcome-notification.processor';
import { EmailVerificationNotificationProcessor } from './infrastructure/bull-mq/processors/email-verification-notification.processor';

@Module({
  imports: [
    UserModule,
    ActionTokenModule,
    SuspendedAccountModule,
    NotificationModule,
  ],
  controllers: [
    AuthController,
    PasswordController,
  ],
  providers: [
    ActionTokenVerifierService,
    AuthTokenService,
    VerifySetFirstPasswordTokenUseCase,
    SetFirstPasswordUseCase,
    SignupUseCase,
    CompleteSignupUseCase,
    LoginUseCase,
    ForgetPasswordUseCase,
    VerifyResetPasswordTokenUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    ResetPasswordNotificationProcessor,
    WelcomeNotificationProcessor,
    EmailVerificationNotificationProcessor,
  ],
})
export class AuthModule {}
