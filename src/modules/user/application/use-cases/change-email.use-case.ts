import { Inject, Injectable } from '@nestjs/common';
import { ChangeEmailInput } from '../inputs/change-email.input';
import { PasswordHashingHelper } from 'src/modules/shared/application/helpers/password-hashing.helper';
import { UserModel } from '../../domain/models/user.model';
import { UserValidatorService } from '../services/user-validator.service';
import { ActionTokenService } from 'src/modules/action-token/application/services/action-token.service';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { UserFinderService } from '../services/user-finder.service';
import { UserProfileChangeModel } from '../../domain/models/user-profile-change.model';
import { UserProfileFieldEnum } from '../../domain/enums/user-profile-field.enum';
import { USER_PROFILE_CHANGE_REPOSITORY } from '../constants/user-profile-change-repository.constant';
import { IUserProfileChangeRepository } from '../interfaces/user-profile-change-repository.interface';
import { ChangeEmailNotificationMessage } from 'src/modules/user/application/notification/messages/change-email-notification-message.input';
import { BusinessRuleViolationError } from 'src/modules/shared/domain/errors/business-rule-violation.error';
import { NOTIFICATION_SERVICE } from 'src/modules/notification/application/constants/notification-service.constant';
import { INotificationService } from 'src/modules/notification/application/interfaces/notification-service.interface';
import { ActionTokenModel } from 'src/modules/action-token/domain/models/action-token.model';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';

@Injectable()
export class ChangeEmailUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly userValidatorService: UserValidatorService,
    @Inject(USER_PROFILE_CHANGE_REPOSITORY)
    private readonly userProfileChangeRepository: IUserProfileChangeRepository,
    private readonly actionTokenService: ActionTokenService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: INotificationService,
  ) {}

  private async validatePassword(
    user: UserModel,
    password: string,
  ): Promise<void> {
    const isPasswordValid = await PasswordHashingHelper.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BusinessRuleViolationError(
        'user.email.change.incorrect_password',
      );
    }
  }

  private async createEmailChangeRequest(
    user: UserModel,
    newEmail: string,
  ): Promise<UserProfileChangeModel> {
    const userProfileChange =
      await this.userProfileChangeRepository.getByUserIdAndField(
        user.id,
        UserProfileFieldEnum.EMAIL,
      );
    if (userProfileChange?.isStatusPending()) {
      userProfileChange.update({ oldValue: user.email, newValue: newEmail });
      return userProfileChange;
    }
    return new UserProfileChangeModel({
      userId: user.id,
      field: UserProfileFieldEnum.EMAIL,
      oldValue: user.email,
      newValue: newEmail,
    });
  }

  private async generateChangeEmailToken(
    userId: number,
    manager: unknown,
  ): Promise<ActionTokenModel> {
    const payload = {
      userId,
    };
    return this.actionTokenService.generate(
      ActionTokenTypeEnum.CHANGE_EMAIL,
      payload,
      userId,
      manager,
    );
  }

  private async saveUserProfileChangeAndGenerateChangeEmailToken(
    userProfileChange: UserProfileChangeModel,
  ): Promise<ActionTokenModel> {
    return this.unitOfWork.transaction(async (manager) => {
      const savedUserProfileChange =
        await this.userProfileChangeRepository.save(userProfileChange, manager);
      return await this.generateChangeEmailToken(
        savedUserProfileChange.userId,
        manager,
      );
    });
  }

  private async sendChangeEmailVerification(
    user: UserModel,
    actionToken: ActionTokenModel,
  ): Promise<void> {
    const message = new ChangeEmailNotificationMessage({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      currentEmail: user.email,
      upcomingEmail: user.email,
      userTypes: user.types,
      token: actionToken.token,
      expirationDate: actionToken.expiresAt,
    });
    await this.notificationService.send(message);
  }

  async execute(id: number, changeEmailInput: ChangeEmailInput): Promise<void> {
    const user = await this.userFinderService.getById(id);
    await this.validatePassword(user, changeEmailInput.password);
    await this.userValidatorService.checkEmailDuplicate(
      changeEmailInput.newEmail,
      user.appUi,
      user.id,
    );
    const userProfileChange = await this.createEmailChangeRequest(
      user,
      changeEmailInput.newEmail,
    );
    const actionToken =
      await this.saveUserProfileChangeAndGenerateChangeEmailToken(
        userProfileChange,
      );
    await this.sendChangeEmailVerification(user, actionToken);
  }
}
