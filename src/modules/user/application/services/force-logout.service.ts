import { Injectable } from "@nestjs/common";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { ActionTokenTypeEnum } from "src/modules/action-token/domain/enums/action-token-type.enum";

@Injectable()
export class ForceLogoutService {
  constructor(
    private readonly actionTokenService: ActionTokenService,
  ) {}

  async execute(userId: number, manager?: unknown): Promise<void> {
    const actionTokens = await this.actionTokenService.getActiveTokensByUserIdAndType(userId, ActionTokenTypeEnum.REFRESH_TOKEN);
    await this.actionTokenService.revokeMany(actionTokens, manager);
  }
}