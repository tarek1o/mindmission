import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';
import { ITokenStrategy } from "../../application/interfaces/action-token-strategy.interface";
import { ActionTokenModel } from "../../domain/models/action-token.model";
import { ActionTokenTypeEnum } from "../../domain/enums/action-token-type.enum";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { ACTION_TOKEN_REPOSITORY } from "../../application/constants/action-token-repository.constant";
import { IActionTokenRepository } from "../../application/interfaces/action-token-repository.interface";
import { IActionTokenConfiguration, TokenDurationLifeTime } from "src/infrastructure/configuration/interfaces/sub-interfaces/action-token-config.interface";
import { TokenStrategyType } from "../../application/enums/token-strategy-type.enum";
import { TokenRawStrategyManager } from "../../application/services/token-raw-manger.service";
import { BusinessRuleViolationError } from "src/modules/shared/domain/errors/business-rule-violation.error";

@Injectable()
export class StatefulTokenStrategy implements ITokenStrategy {
  constructor(
    private readonly tokenRawStrategyManager: TokenRawStrategyManager,
    private readonly configService: ConfigService<IEnvironmentConfiguration, true>,
    @Inject(ACTION_TOKEN_REPOSITORY) private actionTokenRepository: IActionTokenRepository,
  ) {}

  private getExpirationDate(type: ActionTokenTypeEnum): Date | null {
    const durationConfig: TokenDurationLifeTime = this.configService.get<IActionTokenConfiguration>('actionTokens').stateful[type];
    return durationConfig ? moment().add(durationConfig.value, durationConfig.unit).toDate() : null;
  }

  getRawToken(type: ActionTokenTypeEnum): string {
    const strategy = this.tokenRawStrategyManager.get(type);
    return strategy.generate();
  }

  async generate<T>(options: { type: ActionTokenTypeEnum, payload: T, userId?: number }, manager?: unknown): Promise<ActionTokenModel> {
    const token = this.getRawToken(options.type);
    const expiresAt = this.getExpirationDate(options.type);
    const actionToken = new ActionTokenModel({
      uuid: uuid(),
      token,
      type: options.type,
      strategy: TokenStrategyType.STATEFUL,
      payload: options.payload,
      userId: options.userId,
      expiresAt
    });
    return this.actionTokenRepository.save(actionToken, manager);
  }

  async verify(type: ActionTokenTypeEnum, token: string, uuid?: string): Promise<ActionTokenModel> {
    const actionToken = uuid ? await this.actionTokenRepository.getByTokenAndUUID(type, token, uuid) : await this.actionTokenRepository.getByToken(type, token);
    this.checkExpiry(actionToken);
    this.checkRevocation(actionToken);
    return actionToken;
  }

  private checkExpiry(actionToken: ActionTokenModel | null): void {
    if(!actionToken || actionToken.isExpired()) {
      throw new BusinessRuleViolationError('action_token.expired');
    }
  }

  private checkRevocation(actionToken: ActionTokenModel | null): void {
    if(!actionToken || actionToken.isRevoked) {
      throw new BusinessRuleViolationError('action_token.revoked');
    }
  }

  async revoke(actionToken: ActionTokenModel, manager?: unknown): Promise<void> {
    if (actionToken.canBeRevoked()) {
      actionToken.markAsRevoked();
      await this.actionTokenRepository.save(actionToken, manager);
    }
  }

  getActiveTokensByUserIdAndType(userId: number, type: ActionTokenTypeEnum): Promise<ActionTokenModel[]> {
    return this.actionTokenRepository.getActiveTokensByUserIdAndTokenType(userId, type);
  }

  async revokeMany(actionTokens: ActionTokenModel[], manager?: unknown): Promise<void> {
    const validActionTokens: ActionTokenModel[] = [];
    actionTokens.forEach(actionToken => {
      if(actionToken.canBeRevoked()) {
        actionToken.markAsRevoked();
        validActionTokens.push(actionToken);
      }
    })
    validActionTokens.length && await this.actionTokenRepository.saveMany(validActionTokens, manager);
  }
}
