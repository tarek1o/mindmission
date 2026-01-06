import { Injectable } from '@nestjs/common';
import { ActionTokenService } from 'src/modules/action-token/application/services/action-token.service';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';
import { ActionTokenModel } from 'src/modules/action-token/domain/models/action-token.model';
import { BusinessRuleViolationError } from 'src/modules/shared/domain/errors/business-rule-violation.error';

@Injectable()
export class ActionTokenVerifierService {
  constructor(private readonly actionTokenService: ActionTokenService) {}

  async verifyResetPasswordToken(token: string): Promise<ActionTokenModel> {
    try {
      return await this.actionTokenService.verify(
        ActionTokenTypeEnum.RESET_PASSWORD_TOKEN,
        token,
      );
    } catch (error) {
      throw new BusinessRuleViolationError('auth.reset_password.invalid_token');
    }
  }

  async verifySetPasswordToken(token: string): Promise<ActionTokenModel> {
    try {
      return await this.actionTokenService.verify(
        ActionTokenTypeEnum.SET_FIRST_PASSWORD_TOKEN,
        token,
      );
    } catch (error) {
      throw new BusinessRuleViolationError(
        'auth.set_first_password.invalid_token',
      );
    }
  }

  async verifyEmailVerificationToken(token: string): Promise<ActionTokenModel> {
    try {
      return await this.actionTokenService.verify(
        ActionTokenTypeEnum.EMAIL_VERIFICATION_TOKEN,
        token,
      );
    } catch (error) {
      throw new BusinessRuleViolationError(
        'auth.signup.invalid_or_expired_email_verification_token',
      );
    }
  }

  async verifyRefreshToken(token: string): Promise<ActionTokenModel> {
    try {
      return await this.actionTokenService.verify(
        ActionTokenTypeEnum.REFRESH_TOKEN,
        token,
      );
    } catch (error) {
      throw new BusinessRuleViolationError('auth.refresh_token.invalid_token');
    }
  }
}
