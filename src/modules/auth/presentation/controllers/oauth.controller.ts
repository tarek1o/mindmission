import { Controller, Get, UseGuards, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { GoogleGuard } from "../guards/google-guard";
import { UserProfileProvider } from "../../../shared/presentation/decorators/user-profile-provider.decorator";
import { OAuthUseCase } from "../../application/use-cases/oauth/oauth.use-case";
import { ProviderProfileInput } from "../../application/inputs/provider-profile.input";
import { UILinks } from "src/infrastructure/configuration/interfaces/sub-interfaces/ui-links.interface";

@Controller({ path: "oauth", version: "1" })
export class OAuthController {
  constructor(
    private readonly oauthUseCase: OAuthUseCase,
    private readonly configService: ConfigService<IEnvironmentConfiguration, true>
  ) {}

  @Get("google")
  @UseGuards(GoogleGuard)
  async google() {}

  private async handleOAuthCallback(providerProfile: ProviderProfileInput, response: Response): Promise<void> {
    const { accessToken, refreshToken } = await this.oauthUseCase.execute(providerProfile);
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    const { oauthCallbackURL } = this.configService.get<UILinks>('uiLinks').mainApp;
    response.redirect(`${oauthCallbackURL}true`);
  }

  @Get("google/callback")
  @UseGuards(GoogleGuard)
  googleCallback(@UserProfileProvider() providerProfile: ProviderProfileInput, @Res() response: Response): Promise<void> {
    return this.handleOAuthCallback(providerProfile, response);
  }
}

