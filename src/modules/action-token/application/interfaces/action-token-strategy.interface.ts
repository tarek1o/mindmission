import { ActionTokenTypeEnum } from "../../domain/enums/action-token-type.enum";
import { ActionTokenModel } from "../../domain/models/action-token.model";

export interface ITokenStrategy {
  generate<T>(options: { type: ActionTokenTypeEnum, payload: T, userId?: number }, manager?: unknown): Promise<ActionTokenModel>;
  verify(type: ActionTokenTypeEnum, token: string, uuid?: string): Promise<ActionTokenModel>;
  revoke?(actionToken: ActionTokenModel, manager?: unknown): Promise<void>;
  revokeMany?(actionTokens: ActionTokenModel[], manager?: unknown): Promise<void>;
  getActiveTokensByUserIdAndType?(userId: number, type: ActionTokenTypeEnum): Promise<ActionTokenModel[]>;
}
