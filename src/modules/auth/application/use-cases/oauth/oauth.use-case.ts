import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "src/modules/user/application/constants/user-repository.constant";
import { IUserRepository } from "src/modules/user/application/interfaces/user-repository.interface";
import { ProviderProfileInput } from "../../inputs/provider-profile.input";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";
import { AuthTokenService } from "../../services/auth-token.service";
import { OAuthFlowStrategyResolverService } from "../../services/oauth-flow-strategy-resolver.service";

@Injectable()
export class OAuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly oauthFlowStrategyResolverService: OAuthFlowStrategyResolverService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async execute(providerProfile: ProviderProfileInput): Promise<{ refreshToken: string, accessToken: string }> {
    const user = await this.userRepository.getByEmail(providerProfile.email, AppUiEnum.MAIN_APP);
    const oauthFlowStrategy = this.oauthFlowStrategyResolverService.resolve(user);
    const savedUser = await oauthFlowStrategy.handle(providerProfile, user);
    const accessTokenModel = await this.authTokenService.generateAccessToken(savedUser);
    const refreshTokenModel = await this.authTokenService.generateRefreshToken(savedUser);
    return {
      accessToken: accessTokenModel.token,
      refreshToken: refreshTokenModel.token,
    };
  };
}