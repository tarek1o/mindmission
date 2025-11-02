import { Inject, Injectable } from "@nestjs/common";
import { SUSPENDED_ACCOUNT_REPOSITORY } from "src/modules/suspended-account/application/constants/suspended-account-repository.constant";
import { ISuspendedAccountRepository } from "src/modules/suspended-account/application/interfaces/suspended-account-repository.interface";
import { USER_REPOSITORY } from "src/modules/user/application/constants/user-repository.constant";
import { IUserRepository } from "src/modules/user/application/interfaces/user-repository.interface";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { NotificationChannelFinderService } from "src/modules/notification/infrastructure/providers/services/notification-channel-finder.service";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { SuspendedReasonEnum } from "src/modules/suspended-account/domain/enums/suspended-reason.enum";
import { NOTIFICATION_SERVICE } from "src/modules/notification/application/constants/notification-service.constant";
import { INotificationService } from "src/modules/notification/application/interfaces/notification-service.interface";
import { ResetPasswordNotificationMessage } from "../../notification/messages/reset-password-notification.message";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { ActionTokenTypeEnum } from "src/modules/action-token/domain/enums/action-token-type.enum";
import { SuspendedAccountModel } from "src/modules/suspended-account/domain/models/suspended-account.model";
import { NotificationEventEnum } from "src/modules/notification/domain/enums/notification-event.enum";

@Injectable()
export class ForgetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(SUSPENDED_ACCOUNT_REPOSITORY) private readonly suspendedAccountRepository: ISuspendedAccountRepository,
    private readonly actionTokenService: ActionTokenService,
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: INotificationService,
  ) {}

  private async isEmailSuspended(email: string): Promise<boolean> {
    const suspendedAccount = await this.suspendedAccountRepository.getByRecipientAndChannel(email, SuspendedReasonEnum.TOO_MANY_PASSWORD_RESET_REQUESTS);
    return !!suspendedAccount?.isSuspended()
  }

  private async generateResetPasswordToken(userId: number, manager: unknown): Promise<ActionTokenModel> {
    const payload = {
      userId,
    };
    return this.actionTokenService.generate(ActionTokenTypeEnum.RESET_PASSWORD_TOKEN, payload, userId, manager);
  }

  private async suspendUserAccount(userEmail: string, suspendedUntil: Date, manager: unknown): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(NotificationEventEnum.RESET_PASSWORD);
    const suspendedAccount = new SuspendedAccountModel({
      channel,
      recipient: userEmail,
      reason: SuspendedReasonEnum.TOO_MANY_PASSWORD_RESET_REQUESTS,
      suspendedUntil,
    });
    await this.suspendedAccountRepository.save(suspendedAccount, manager);
  }

  private async suspendUserAccountAndGenerateResetPasswordToken(user: UserModel): Promise<ActionTokenModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const actionToken = await this.generateResetPasswordToken(user.id, manager);
      await this.suspendUserAccount(user.email, actionToken.expiresAt, manager);
      return actionToken;
    });
  }

  private async sendResetPasswordNotification(user: UserModel, actionToken: ActionTokenModel): Promise<void> {
    const message = new ResetPasswordNotificationMessage({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userTypes: user.types,
      token: actionToken.token,
      expirationDate: actionToken.expiresAt,
    });
    await this.notificationService.send(message);
  }

  async execute(email: string): Promise<void> {
    const isEmailSuspended = await this.isEmailSuspended(email);
    const user = !isEmailSuspended ? await this.userRepository.getByEmail(email) : null;
    if (user?.isEmailVerified) {
      const actionToken = await this.suspendUserAccountAndGenerateResetPasswordToken(user);
      await this.sendResetPasswordNotification(user, actionToken);
    }
  }
}