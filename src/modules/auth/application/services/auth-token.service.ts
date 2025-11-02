import { Injectable } from "@nestjs/common";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { ActionTokenTypeEnum } from "src/modules/action-token/domain/enums/action-token-type.enum";
import { AccessTokenPayload } from "../types/access-token-payload.type";

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly actionTokenService: ActionTokenService,
  ) {}

  async generateAccessToken(user: UserModel): Promise<ActionTokenModel<AccessTokenPayload>> {
    const payload: AccessTokenPayload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      types: user.types,
      roles: user.roles.map(role => role.id)
    }
    return this.actionTokenService.generate(ActionTokenTypeEnum.ACCESS_TOKEN, payload);
  }

  async generateRefreshToken(user: UserModel, manager?: unknown): Promise<ActionTokenModel> {
    const payload = {
      id: user.id,
    };
    return this.actionTokenService.generate(ActionTokenTypeEnum.REFRESH_TOKEN, payload, user.id, manager);
  }
}