import { SuspendedAccountModel } from 'src/modules/suspended-account/domain/models/suspended-account.model';
import { SuspendedAccountEntity } from '../entities/suspended-account.entity';

export abstract class SuspendedAccountMapper {
  static toModel(entity: SuspendedAccountEntity): SuspendedAccountModel {
    return new SuspendedAccountModel({
      id: entity.id,
      recipient: entity.recipient,
      channel: entity.channel,
      reason: entity.reason,
      suspendedUntil: entity.suspendedUntil,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: SuspendedAccountModel): SuspendedAccountEntity {
    return new SuspendedAccountEntity({
      id: model.id,
      recipient: model.recipient,
      channel: model.channel,
      reason: model.reason,
      suspendedUntil: model.suspendedUntil,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}
