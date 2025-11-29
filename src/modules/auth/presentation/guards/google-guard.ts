import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { OAuthProviderEnum } from "src/modules/auth/domain/enums/oauth-provider.enum";

@Injectable()
export class GoogleGuard extends AuthGuard(OAuthProviderEnum.GOOGLE) {}
