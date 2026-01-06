import { IBaseRepository } from 'src/modules/shared/application/interfaces/base-repository.interface';
import { OAuthProfileModel } from '../../domain/models/oauth-profile.model';
import { OAuthProviderEnum } from '../../domain/enums/oauth-provider.enum';

export interface IOAuthProviderRepository extends IBaseRepository<OAuthProfileModel> {
  getByProviderIdAndUserId(
    provider: OAuthProviderEnum,
    userId: number,
  ): Promise<OAuthProfileModel | null>;
}
