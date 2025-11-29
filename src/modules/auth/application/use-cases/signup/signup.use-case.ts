import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "src/modules/user/application/constants/user-repository.constant";
import { IUserRepository } from "src/modules/user/application/interfaces/user-repository.interface";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { NOTIFICATION_SERVICE } from "src/modules/notification/application/constants/notification-service.constant";
import { INotificationService } from "src/modules/notification/application/interfaces/notification-service.interface";
import { SignupInput } from "../../inputs/signup.input";
import { UserValidatorService } from "src/modules/user/application/services/user-validator.service";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";
import { PasswordHashingHelper } from "src/modules/shared/application/helpers/password-hashing.helper";
import { EmailVerificationNotificationMessage } from "src/modules/auth/application/notification/messages/email-verification-notification.message.";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { ActionTokenTypeEnum } from "src/modules/action-token/domain/enums/action-token-type.enum";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userValidator: UserValidatorService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly actionTokenService: ActionTokenService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: INotificationService,
  ) {}

  private async createUserModel(signUpDto: SignupInput): Promise<UserModel> {
    return new UserModel({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      password: await PasswordHashingHelper.hash(signUpDto.password),
      mobilePhone: signUpDto.mobilePhone,
      whatsAppNumber: signUpDto.whatsAppNumber,
      isEmailVerified: false,
      types: [UserTypeEnum.STUDENT],
    });
  }

  private async generateEmailVerificationToken(userId: number, manager: unknown): Promise<ActionTokenModel> {
    const payload = {
      userId,
    }
    return this.actionTokenService.generate(ActionTokenTypeEnum.EMAIL_VERIFICATION_TOKEN, payload, userId, manager);
  }

  private async saveUserAndGenerateEmailVerificationToken(user: UserModel): Promise<{ user: UserModel, actionToken: ActionTokenModel }> {
    return this.unitOfWork.transaction(async (manager) => {
      const savedUser = await this.userRepository.save(user, manager);
      const actionToken = await this.generateEmailVerificationToken(savedUser.id, manager);
      return { 
        user: savedUser, 
        actionToken 
      };
    })
  }

  private async sendEmailVerificationNotification(user: UserModel, actionToken: ActionTokenModel): Promise<void> {
    const message = new EmailVerificationNotificationMessage({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: actionToken.token,
      expirationDate: actionToken.expiresAt,
    });
    await this.notificationService.send(message);
  }

  async execute(signUpDto: SignupInput): Promise<void> {
    await this.userValidator.checkEmailDuplicate(signUpDto.email, AppUiEnum.MAIN_APP);
    const userModel = await this.createUserModel(signUpDto);
    const { user, actionToken } = await this.saveUserAndGenerateEmailVerificationToken(userModel);
    await this.sendEmailVerificationNotification(user, actionToken);
  }
}