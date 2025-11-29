import { BaseModel } from "src/modules/shared/domain/models/base.model";
import { OAuthProviderEnum } from "../enums/oauth-provider.enum";
import { OAuthProfileProps } from "../interfaces/oauth-profile-props.interface";

export class OAuthProfileModel extends BaseModel {
  providerId: string;
  userId: number;
  provider: OAuthProviderEnum;

  constructor(props: OAuthProfileProps) {
    super(props);
    this.providerId = props.providerId;
    this.userId = props.userId;
    this.provider = props.provider;
  }

  override update(props: Partial<OAuthProfileProps>): void {
    super.update(props);
    this.providerId = props.providerId ?? this.providerId;
    this.userId = props.userId ?? this.userId;
    this.provider = props.provider ?? this.provider;
  }
}