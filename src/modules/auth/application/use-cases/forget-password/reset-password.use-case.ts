import { Inject, Injectable } from '@nestjs/common';
import { ActionTokenService } from 'src/modules/action-token/application/services/action-token.service';
import { USER_REPOSITORY } from 'src/modules/user/application/constants/user-repository.constant';
import { IUserRepository } from 'src/modules/user/application/interfaces/user-repository.interface';
import { UNIT_OF_WORK } from 'src/modules/shared/application/constant/unit-of-work.constant';
import { IUnitOfWork } from 'src/modules/shared/application/interfaces/unit-of-work.interface';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { ActionTokenModel } from 'src/modules/action-token/domain/models/action-token.model';
import { ResetPasswordInput } from '../../inputs/reset-password.input';
import { UserModel } from 'src/modules/user/domain/models/user.model';
import { PasswordHashingHelper } from 'src/modules/shared/application/helpers/password-hashing.helper';
import { BusinessRuleViolationError } from 'src/modules/shared/domain/errors/business-rule-violation.error';
import { ActionTokenVerifierService } from '../../services/action-token-verifier.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly actionTokenVerifierService: ActionTokenVerifierService,
    private readonly actionTokenService: ActionTokenService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async getUserById(userId: number) {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new BusinessRuleViolationError(
        'auth.reset_password.user_not_found',
      );
    }
    return user;
  }

  private async forceLogout(userId: number, manager?: unknown): Promise<void> {
    const actionTokens =
      await this.actionTokenService.getActiveTokensByUserIdAndType(
        userId,
        ActionTokenTypeEnum.REFRESH_TOKEN,
      );
    await this.actionTokenService.revokeMany(actionTokens, manager);
  }

  private async finalizePasswordReset(
    user: UserModel,
    actionToken: ActionTokenModel,
  ): Promise<void> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.userRepository.save(user, manager);
      await this.actionTokenService.revoke(actionToken, manager);
      await this.forceLogout(user.id, manager);
    });
  }

  async execute(resetPasswordInput: ResetPasswordInput): Promise<void> {
    const actionToken =
      await this.actionTokenVerifierService.verifyResetPasswordToken(
        resetPasswordInput.token,
      );
    const user = await this.getUserById(actionToken.userId);
    const hashedPassword = await PasswordHashingHelper.hash(
      resetPasswordInput.password,
    );
    user.changePassword(hashedPassword);
    await this.finalizePasswordReset(user, actionToken);
  }
}
