import { Injectable } from "@nestjs/common";
import { UserFinderService } from "src/modules/user/application/services/user-finder.service";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { BusinessRuleViolationError } from "src/modules/shared/domain/errors/business-rule-violation.error";
import { ActionTokenVerifierService } from "../../services/action-token-verifier.service";

@Injectable()
export class VerifySetFirstPasswordTokenUseCase {
  constructor(
    private readonly actionTokenVerifierService: ActionTokenVerifierService,
    private readonly userFinderService: UserFinderService,
  ) {}

  private checkUserIsSetPassword(user: UserModel): void {
    if(user.isPasswordSet) {
      throw new BusinessRuleViolationError('auth.set_first_password.user_already_set_password');
    }
  }

  async execute(token: string): Promise<void> {
    const actionPayload = await this.actionTokenVerifierService.verifySetPasswordToken(token);
    const user = await this.userFinderService.getById(actionPayload.userId);
    this.checkUserIsSetPassword(user);
  }
}