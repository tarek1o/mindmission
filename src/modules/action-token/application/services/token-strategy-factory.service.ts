import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ITokenStrategy } from '../interfaces/action-token-strategy.interface';
import { ActionTokenTypeEnum } from '../../domain/enums/action-token-type.enum';
import { TokenStrategyType } from '../enums/token-strategy-type.enum';

@Injectable()
export class TokenStrategyFactory {
  private readonly tokenStrategyMap: Record<
    ActionTokenTypeEnum,
    TokenStrategyType
  > = {
    [ActionTokenTypeEnum.ACCESS_TOKEN]: TokenStrategyType.STATELESS,
    [ActionTokenTypeEnum.EMAIL_VERIFICATION_TOKEN]: TokenStrategyType.STATEFUL,
    [ActionTokenTypeEnum.REFRESH_TOKEN]: TokenStrategyType.STATEFUL,
    [ActionTokenTypeEnum.RESET_PASSWORD_TOKEN]: TokenStrategyType.STATEFUL,
    [ActionTokenTypeEnum.SET_FIRST_PASSWORD_TOKEN]: TokenStrategyType.STATEFUL,
    [ActionTokenTypeEnum.CHANGE_EMAIL]: TokenStrategyType.STATEFUL,
  };

  constructor(private readonly modRef: ModuleRef) {}

  get(type: ActionTokenTypeEnum): ITokenStrategy {
    const strategy = this.tokenStrategyMap[type];
    if (!strategy) {
      throw new Error(`No strategy for ${type} token`);
    }
    return this.modRef.get<ITokenStrategy>(strategy);
  }
}
