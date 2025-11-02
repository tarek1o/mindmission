import { Inject, Injectable } from "@nestjs/common";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { SetFirstPasswordInput } from "../../inputs/set-first-password.input";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { PasswordHashingHelper } from "src/modules/shared/application/helpers/password-hashing.helper";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { ActionTokenVerifierService } from "../../services/action-token-verifier.service";
import { USER_REPOSITORY } from "src/modules/user/application/constants/user-repository.constant";
import { IUserRepository } from "src/modules/user/application/interfaces/user-repository.interface";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { UserFinderService } from "src/modules/user/application/services/user-finder.service";

Injectable()
export class SetFirstPasswordUseCase {
  constructor(
    private readonly actionTokenVerifierService: ActionTokenVerifierService,
    private readonly actionTokenService: ActionTokenService,
    private readonly userFinderService: UserFinderService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async savePasswordAndRevokeToken(user: UserModel, actionToken: ActionTokenModel): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.userRepository.save(user, manager);
      await this.actionTokenService.revoke(actionToken, manager);
    })
  }

  async execute(setFirstPasswordInput: SetFirstPasswordInput): Promise<void> {
    const actionToken = await this.actionTokenVerifierService.verifySetPasswordToken(setFirstPasswordInput.token);
    const user = await this.userFinderService.getById(actionToken.userId);
    const hashedPassword = await PasswordHashingHelper.hash(setFirstPasswordInput.password);
    user.setFirstPassword(hashedPassword);
    await this.savePasswordAndRevokeToken(user, actionToken);
  }
}