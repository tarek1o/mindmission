import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { OAuthConfiguration } from "src/infrastructure/configuration/interfaces/sub-interfaces/oauth-configuration.interface";
import { OAuthProviderEnum } from "src/modules/auth/domain/enums/oauth-provider.enum";
import { ProviderProfileInput } from "src/modules/auth/application/inputs/provider-profile.input";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, OAuthProviderEnum.GOOGLE) {
  constructor(configService: ConfigService<IEnvironmentConfiguration, true>) {
    const options = configService.get<OAuthConfiguration>('oauth').google;
    super(options);
  }
  
  async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
    const providerProfile: ProviderProfileInput = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      picture: profile.photos[0].value,
      providerId: profile.id,
      provider: OAuthProviderEnum.GOOGLE,
    };
    done(null, providerProfile);
  }
}

