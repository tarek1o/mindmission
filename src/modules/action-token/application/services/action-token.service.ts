import { Injectable } from '@nestjs/common';
import { TokenStrategyFactory } from './token-strategy-factory.service';
import { ActionTokenTypeEnum } from '../../domain/enums/action-token-type.enum';
import { ActionTokenModel } from '../../domain/models/action-token.model';

@Injectable()
export class ActionTokenService {
  constructor(private readonly tokenStrategyFactory: TokenStrategyFactory) {}

  getActiveTokensByUserIdAndType<T>(
    userId: number,
    type: ActionTokenTypeEnum,
  ): Promise<ActionTokenModel<T>[]> {
    const service = this.tokenStrategyFactory.get(type);
    return service.getActiveTokensByUserIdAndType(userId, type);
  }

  generate<T>(
    type: ActionTokenTypeEnum,
    payload: T,
    userId?: number,
    manager?: unknown,
  ): Promise<ActionTokenModel<T>> {
    const service = this.tokenStrategyFactory.get(type);
    return service.generate<T>({ type, payload, userId }, manager);
  }

  verify<T>(
    type: ActionTokenTypeEnum,
    token: string,
  ): Promise<ActionTokenModel<T>> {
    const service = this.tokenStrategyFactory.get(type);
    return service.verify(type, token);
  }

  revoke(actionTokens: ActionTokenModel, manager?: unknown): Promise<void> {
    const service = this.tokenStrategyFactory.get(actionTokens.type);
    return service.revoke(actionTokens, manager);
  }

  private groupByType(
    actionTokens: ActionTokenModel[],
  ): Map<ActionTokenTypeEnum, ActionTokenModel[]> {
    const map = new Map<ActionTokenTypeEnum, ActionTokenModel[]>();
    for (const token of actionTokens) {
      if (!map.has(token.type)) {
        map.set(token.type, []);
      }
      map.get(token.type)!.push(token);
    }
    return map;
  }

  async revokeMany(
    actionTokens: ActionTokenModel[],
    manager?: unknown,
  ): Promise<void> {
    const map = this.groupByType(actionTokens);
    await Promise.all(
      Array.from(map.entries()).map(([type, tokens]) => {
        const service = this.tokenStrategyFactory.get(type);
        return service.revokeMany(tokens, manager);
      }),
    );
  }
}
