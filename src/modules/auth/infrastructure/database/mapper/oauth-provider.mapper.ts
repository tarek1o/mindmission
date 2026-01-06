import { OAuthProfileModel } from 'src/modules/auth/domain/models/oauth-profile.model';
import { OAuthProviderEntity } from '../entities/oauth-provider.entity';

export abstract class OAuthProviderMapper {
  static toModel(entity: OAuthProviderEntity): OAuthProfileModel {
    return new OAuthProfileModel({
      id: entity.id,
      providerId: entity.providerId,
      userId: entity.userId,
      provider: entity.provider,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(model: OAuthProfileModel): OAuthProviderEntity {
    return new OAuthProviderEntity({
      id: model.id,
      providerId: model.providerId,
      userId: model.userId,
      provider: model.provider,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }
}
