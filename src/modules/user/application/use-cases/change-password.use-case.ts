import { Inject, Injectable } from "@nestjs/common";
import { UserFinderService } from "../services/user-finder.service";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { NOTIFICATION_SERVICE } from "src/modules/notification/application/constants/notification-service.constant";
import { INotificationService } from "src/modules/notification/application/interfaces/notification-service.interface";
import { ChangePasswordInput } from "../inputs/change-password.input";
import { PasswordHashingHelper } from "src/modules/shared/application/helpers/password-hashing.helper";
import { UserModel } from "../../domain/models/user.model";
import { ForceLogoutService } from "../services/force-logout.service";
import { PasswordChangedNotificationMessage } from "src/modules/user/application/notification/messages/password-changed-notification-message.input";
import { BusinessRuleViolationError } from "src/modules/shared/domain/errors/business-rule-violation.error";

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly forceLogoutService: ForceLogoutService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: INotificationService,
  ) {}

  private async validatePassword(user: UserModel, password: string): Promise<void> {
    const isPasswordValid = await PasswordHashingHelper.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BusinessRuleViolationError('user.password.change.incorrect_password');
    }
  }

  private completePasswordChange(user: UserModel): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.userRepository.save(user, manager);
      await this.forceLogoutService.execute(user.id, manager);
    });
  }

  private async sendPasswordChangeNotification(user: UserModel): Promise<void> {
    const message = new PasswordChangedNotificationMessage({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    await this.notificationService.send(message);
  }

  async execute(id: number, changePasswordInput: ChangePasswordInput): Promise<void> {
    const user = await this.userFinderService.getById(id);
    await this.validatePassword(user, changePasswordInput.oldPassword);
    const hashedPassword = await PasswordHashingHelper.hash(changePasswordInput.newPassword);
    user.changePassword(hashedPassword);
    await this.completePasswordChange(user);
    await this.sendPasswordChangeNotification(user);
  }
}