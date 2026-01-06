import { Injectable } from '@nestjs/common';
import { ActionTokenService } from 'src/modules/action-token/application/services/action-token.service';
import { ActionTokenTypeEnum } from 'src/modules/action-token/domain/enums/action-token-type.enum';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly actionTokenService: ActionTokenService) {}

  async execute(refreshToken: string): Promise<void> {
    const actionToken = await this.actionTokenService.verify(
      ActionTokenTypeEnum.REFRESH_TOKEN,
      refreshToken,
    );
    await this.actionTokenService.revoke(actionToken);
  }
}
