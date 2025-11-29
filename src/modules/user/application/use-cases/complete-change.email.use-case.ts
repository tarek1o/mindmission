import { Inject, Injectable } from "@nestjs/common";
import { UserFinderService } from "../services/user-finder.service";
import { UserValidatorService } from "../services/user-validator.service";
import { USER_REPOSITORY } from "../constants/user-repository.constant";
import { IUserRepository } from "../interfaces/user-repository.interface";
import { USER_PROFILE_CHANGE_REPOSITORY } from "../constants/user-profile-change-repository.constant";
import { IUserProfileChangeRepository } from "../interfaces/user-profile-change-repository.interface";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { ActionTokenTypeEnum } from "src/modules/action-token/domain/enums/action-token-type.enum";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { UserProfileChangeModel } from "../../domain/models/user-profile-change.model";
import { UserModel } from "../../domain/models/user.model";
import { BusinessRuleViolationError } from "src/modules/shared/domain/errors/business-rule-violation.error";
import { ForceLogoutService } from "../services/force-logout.service";

@Injectable()
export class CompleteChangeEmailUseCase {
  constructor(
    private readonly userFinderService: UserFinderService,
    private readonly userValidatorService: UserValidatorService,
    @Inject(USER_PROFILE_CHANGE_REPOSITORY) private readonly userProfileChangeRepository: IUserProfileChangeRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly forceLogoutService: ForceLogoutService,
    private readonly actionTokenService: ActionTokenService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async verifyChangeEmailToken(token: string): Promise<ActionTokenModel> {
    try {
      return await this.actionTokenService.verify(ActionTokenTypeEnum.CHANGE_EMAIL, token);
    } catch (error) {
      throw new BusinessRuleViolationError('action_token.invalid');
    }
  }

  private async getEmailChangeRequest(id: number): Promise<UserProfileChangeModel> {
    const userProfileChange = await this.userProfileChangeRepository.getById(id);
    if (!userProfileChange) {
      throw new BusinessRuleViolationError('user_profile_change.not_found');
    }
    return userProfileChange;
  }


  private async applyEmailChange(actionToken: ActionTokenModel, user: UserModel, userProfileChange: UserProfileChangeModel): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.actionTokenService.revoke(actionToken, manager);
      await this.userRepository.save(user, manager);
      await this.userProfileChangeRepository.save(userProfileChange, manager);
      await this.forceLogoutService.execute(user.id, manager);
    })
  }

  async execute(token: string): Promise<void> {
    const actionToken = await this.verifyChangeEmailToken(token);
    const userProfileChange = await this.getEmailChangeRequest(actionToken.payload.userProfileChangeId);
    const user = await this.userFinderService.getById(actionToken.userId);
    await this.userValidatorService.checkEmailDuplicate(userProfileChange.newValue, user.appUi);
    user.changeEmail(userProfileChange.newValue);
    userProfileChange.markAsConfirmed();
    await this.applyEmailChange(actionToken, user, userProfileChange);
  }
}