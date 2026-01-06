import { Inject, Injectable } from '@nestjs/common';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { USER_REPOSITORY } from 'src/modules/user/application/constants/user-repository.constant';
import { ActionTokenVerifierService } from '../../services/action-token-verifier.service';
import { UserFinderService } from 'src/modules/user/application/services/user-finder.service';
import { IUserRepository } from 'src/modules/user/application/interfaces/user-repository.interface';
import { NOTIFICATION_SERVICE } from 'src/modules/notification/application/constants/notification-service.constant';
import { INotificationService } from 'src/modules/notification/application/interfaces/notification-service.interface';
import { CompleteSignupInput } from '../../inputs/complete-signup.input';
import { WelcomeNotificationMessage } from 'src/modules/auth/application/notification/messages/welcome-notification-message';
import { UserModel } from 'src/modules/user/domain/models/user.model';
import { ActionTokenService } from 'src/modules/action-token/application/services/action-token.service';
import { ActionTokenModel } from 'src/modules/action-token/domain/models/action-token.model';
import { BusinessRuleViolationError } from 'src/modules/shared/domain/errors/business-rule-violation.error';

@Injectable()
export class CompleteSignupUseCase {
  constructor(
    private readonly actionTokenService: ActionTokenService,
    private readonly actionTokenVerifierService: ActionTokenVerifierService,
    private readonly userFinderService: UserFinderService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  private ensureNotAlreadyVerified(user: UserModel): void {
    if (user.isEmailVerified) {
      throw new BusinessRuleViolationError('user.email.already_verified');
    }
  }

  private async finalizeUserVerification(
    user: UserModel,
    actionToken: ActionTokenModel,
  ) {
    return this.unitOfWork.transaction(async (manager) => {
      await this.userRepository.save(user, manager);
      await this.actionTokenService.revoke(actionToken, manager);
    });
  }

  private async sendWelcomeNotification(user: UserModel): Promise<void> {
    const message = new WelcomeNotificationMessage({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    await this.notificationService.send(message);
  }

  async execute(completeSignupInput: CompleteSignupInput): Promise<void> {
    const actionToken =
      await this.actionTokenVerifierService.verifyEmailVerificationToken(
        completeSignupInput.token,
      );
    const user = await this.userFinderService.getById(actionToken.userId);
    this.ensureNotAlreadyVerified(user);
    user.markEmailAsVerified();
    await this.finalizeUserVerification(user, actionToken);
    await this.sendWelcomeNotification(user);
  }
}
