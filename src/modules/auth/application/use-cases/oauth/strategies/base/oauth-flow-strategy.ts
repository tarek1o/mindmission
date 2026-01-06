import { ProviderProfileInput } from 'src/modules/auth/application/inputs/provider-profile.input';
import { OAuthProfileModel } from 'src/modules/auth/domain/models/oauth-profile.model';
import { UserModel } from 'src/modules/user/domain/models/user.model';

export abstract class OAuthFlowStrategy {
  abstract handle(
    profile: ProviderProfileInput,
    user?: UserModel,
  ): Promise<UserModel>;

  protected constructOAuthProviderModel(
    providerProfile: ProviderProfileInput,
    userId: number,
  ): OAuthProfileModel {
    return new OAuthProfileModel({
      provider: providerProfile.provider,
      providerId: providerProfile.providerId,
      userId,
    });
  }
}
