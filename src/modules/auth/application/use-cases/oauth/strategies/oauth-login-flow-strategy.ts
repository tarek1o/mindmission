import { Inject, Injectable } from '@nestjs/common';
import { OAuthFlowStrategy } from './base/oauth-flow-strategy';
import { UserModel } from 'src/modules/user/domain/models/user.model';
import { ProviderProfileInput } from '../../../inputs/provider-profile.input';
import { IOAuthProviderRepository } from '../../../interfaces/oauth-provider-repository.interface';
import { OAUTH_PROVIDER_REPOSITORY } from '../../../constants/oauth-provider-repository.constant';

@Injectable()
export class OAuthLoginFlowStrategy extends OAuthFlowStrategy {
  constructor(
    @Inject(OAUTH_PROVIDER_REPOSITORY)
    private readonly oauthProviderRepository: IOAuthProviderRepository,
  ) {
    super();
  }

  async handle(
    providerProfile: ProviderProfileInput,
    user: UserModel,
  ): Promise<UserModel> {
    const oAuthProvider =
      await this.oauthProviderRepository.getByProviderIdAndUserId(
        providerProfile.provider,
        user.id,
      );
    if (!oAuthProvider) {
      const oAuthProviderModel = this.constructOAuthProviderModel(
        providerProfile,
        user.id,
      );
      await this.oauthProviderRepository.save(oAuthProviderModel);
    }
    return user;
  }
}
