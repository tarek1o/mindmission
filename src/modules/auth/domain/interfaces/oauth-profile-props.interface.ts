import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { OAuthProviderEnum } from '../enums/oauth-provider.enum';

export interface OAuthProfileProps extends BaseModelProps {
  providerId: string;
  userId: number;
  provider: OAuthProviderEnum;
}
