import { ActionTokenModel } from 'src/modules/action-token/domain/models/action-token.model';
import { ActionTokenEntity } from '../entities/action-token.entity';
import { TokenStrategyType } from 'src/modules/action-token/application/enums/token-strategy-type.enum';

export abstract class ActionTokenMapper {
  static toModel(entity: ActionTokenEntity): ActionTokenModel {
    return new ActionTokenModel({
      id: entity.id,
      uuid: entity.uuid,
      token: entity.token,
      userId: entity.userId,
      type: entity.type,
      strategy: TokenStrategyType.STATEFUL,
      payload: entity.payload,
      isRevoked: entity.isRevoked,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: ActionTokenModel): ActionTokenEntity {
    return new ActionTokenEntity({
      id: model.id,
      uuid: model.uuid,
      token: model.token,
      userId: model.userId,
      type: model.type,
      payload: model.payload,
      isRevoked: model.isRevoked,
      expiresAt: model.expiresAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}
