import { OAuthProviderEnum } from '../../domain/enums/oauth-provider.enum';

export interface ProviderProfileInput {
  providerId: string;
  firstName: string;
  lastName: string;
  email: string;
  picture?: string | null;
  provider: OAuthProviderEnum;
}
