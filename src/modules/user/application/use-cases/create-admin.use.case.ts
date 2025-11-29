import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { UserValidatorService } from "../services/user-validator.service";
import { NOTIFICATION_SERVICE } from "src/modules/notification/application/constants/notification-service.constant";
import { INotificationService } from "src/modules/notification/application/interfaces/notification-service.interface";
import { CreateUserInput } from "../inputs/create-user.input";
import { UserModel } from "../../domain/models/user.model";
import { PasswordGeneratorHelper } from "src/modules/shared/application/helpers/password-generator.helper";
import { UserTypeEnum } from "../../domain/enums/user-type.enum";
import { RoleModel } from "src/modules/role/domain/models/role.model";
import { SetFirstPasswordNotificationMessage } from "src/modules/user/application/notification/messages/set-first-password.message";
import { PasswordHashingHelper } from "src/modules/shared/application/helpers/password-hashing.helper";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { ActionTokenTypeEnum } from "src/modules/action-token/domain/enums/action-token-type.enum";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private readonly userValidatorService: UserValidatorService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly actionTokenService: ActionTokenService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
    @Inject(NOTIFICATION_SERVICE) private readonly notificationService: INotificationService,
  ) {}

  private async createUserModel(createUserDto: CreateUserInput, roles: RoleModel[]): Promise<UserModel> {
    const password = PasswordGeneratorHelper.generate();
    return new UserModel({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      isEmailVerified: false,
      password: await PasswordHashingHelper.hash(password),
      isPasswordSet: false,
      types: [UserTypeEnum.ADMIN],
      roles,
      mobilePhone: createUserDto.mobilePhone,
      whatsAppNumber: createUserDto.whatsAppNumber,
    });
  }

  private async createSetPasswordToken(user: UserModel, manager?: unknown): Promise<ActionTokenModel> {
    const payload = {
      userId: user.id,
    }
    return this.actionTokenService.generate(ActionTokenTypeEnum.SET_FIRST_PASSWORD_TOKEN, payload, user.id, manager);
  }

  private async saveUserAndGenerateSetPasswordToken(user: UserModel): Promise<{ user: UserModel, actionToken: ActionTokenModel }> {
    return this.unitOfWork.transaction(async (manager) => {
      const savedUser = await this.userRepository.save(user, manager);
      const actionToken = await this.createSetPasswordToken(savedUser, manager);
      return { 
        user: savedUser, 
        actionToken,
      };
    })
  }

  private async sendSetFirstPasswordNotification(user: UserModel, actionToken: ActionTokenModel): Promise<void> {
    const message = new SetFirstPasswordNotificationMessage({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: actionToken.token,
     });
    await this.notificationService.send(message);
  }

  async execute(createUserDto: CreateUserInput): Promise<UserModel> {
    await this.userValidatorService.checkEmailDuplicate(createUserDto.email, AppUiEnum.DASHBOARD);
    const roles = await this.userValidatorService.validateRoles(createUserDto.rolesIds); // TODO: use role validator service in role module
    const userModel = await this.createUserModel(createUserDto, roles);
    const { user, actionToken } = await this.saveUserAndGenerateSetPasswordToken(userModel);
    await this.sendSetFirstPasswordNotification(user, actionToken);
    return user;
  }
}