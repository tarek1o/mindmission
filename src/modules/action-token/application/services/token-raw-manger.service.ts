import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ActionTokenTypeEnum } from "../../domain/enums/action-token-type.enum";
import { TokenRawTypeEnum } from "../enums/token-raw-type.enum";
import { ITokenRawStrategy } from "../interfaces/token-raw-strategy.interface";

@Injectable()
export class TokenRawStrategyManager {
  private readonly tokenRawStrategyMap: Record<ActionTokenTypeEnum, TokenRawTypeEnum> = {
    [ActionTokenTypeEnum.ACCESS_TOKEN]: TokenRawTypeEnum.JWT,
    [ActionTokenTypeEnum.EMAIL_VERIFICATION_TOKEN]: TokenRawTypeEnum.RANDOM_STRING,
    [ActionTokenTypeEnum.REFRESH_TOKEN]: TokenRawTypeEnum.RANDOM_STRING,
    [ActionTokenTypeEnum.RESET_PASSWORD_TOKEN]: TokenRawTypeEnum.RANDOM_STRING,
    [ActionTokenTypeEnum.SET_PASSWORD_TOKEN]: TokenRawTypeEnum.RANDOM_STRING,
    [ActionTokenTypeEnum.CHANGE_EMAIL]: TokenRawTypeEnum.RANDOM_STRING,
  }

  constructor(
    private readonly modRef: ModuleRef,
  ) {}

  get(type: ActionTokenTypeEnum): ITokenRawStrategy {
    const strategy = this.tokenRawStrategyMap[type];
    if(!strategy) {
      throw new Error(`No raw strategy for ${type} token`);
    }
    return this.modRef.get<ITokenRawStrategy>(strategy);
  }
}