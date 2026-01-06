import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOAuthProviderRepository } from 'src/modules/auth/application/interfaces/oauth-provider-repository.interface';
import { OAuthProviderEntity } from '../entities/oauth-provider.entity';
import { OAuthProviderEnum } from 'src/modules/auth/domain/enums/oauth-provider.enum';
import { OAuthProfileModel } from 'src/modules/auth/domain/models/oauth-profile.model';
import { OAuthProviderMapper } from '../mapper/oauth-provider.mapper';
import { BaseDomainError } from 'src/modules/shared/domain/errors/base/base-domain.error';
import { ErrorMappingResult } from 'src/modules/shared/infrastructure/database/types/error-mapping-result.type';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';
import { OAUTH_PROVIDER_INDEXES_CONSTANTS } from '../constants/oauth-provider-indexes.constant';

@Injectable()
export class OAuthProviderRepository implements IOAuthProviderRepository {
  constructor(
    @InjectRepository(OAuthProviderEntity)
    private readonly oauthProviderRepository: Repository<OAuthProviderEntity>,
  ) {}

  async getByProviderIdAndUserId(
    provider: OAuthProviderEnum,
    userId: number,
  ): Promise<OAuthProfileModel | null> {
    const entity = await this.oauthProviderRepository.findOne({
      where: {
        provider,
        userId,
      },
    });
    return entity ? OAuthProviderMapper.toModel(entity) : null;
  }

  async save(oauthProvider: OAuthProfileModel): Promise<OAuthProfileModel> {
    try {
      const entity = OAuthProviderMapper.toEntity(oauthProvider);
      const savedEntity = await this.oauthProviderRepository.save(entity);
      return OAuthProviderMapper.toModel(savedEntity);
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint:
          OAUTH_PROVIDER_INDEXES_CONSTANTS.OAUTH_PROVIDERS_PROVIDER_ID_USER_ID_PARTIAL_UNIQUE_INDEX,
        error: new ConflictError('oauth.provider.duplicate'),
      },
    ];
    const errorException = errorMappingResult.find(
      (errorException) =>
        (error as any).driverError.constraint === errorException.constraint,
    );
    throw errorException?.error ?? error;
  }
}
