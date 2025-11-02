import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { ActionTokenTypeEnum } from "../../domain/enums/action-token-type.enum";

export interface IActionTokenRepository {
  getByToken(type: ActionTokenTypeEnum, token: string): Promise<ActionTokenModel | null>;
  getByTokenAndUUID(type: ActionTokenTypeEnum, token: string, uuid: string): Promise<ActionTokenModel | null>;
  getActiveTokensByUserIdAndTokenType(userId: number, type: ActionTokenTypeEnum): Promise<ActionTokenModel[]>;
  getByUserIdAndToken(userId: number, token: string): Promise<ActionTokenModel | null>;
  save(actionToken: ActionTokenModel, manager?: unknown): Promise<ActionTokenModel>;
  saveMany(actionTokens: ActionTokenModel[], manager?: unknown): Promise<ActionTokenModel[]>;
}