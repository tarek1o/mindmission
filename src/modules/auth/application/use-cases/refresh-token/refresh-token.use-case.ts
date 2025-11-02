import { Inject, Injectable } from "@nestjs/common";
import { ActionTokenService } from "src/modules/action-token/application/services/action-token.service";
import { ActionTokenModel } from "src/modules/action-token/domain/models/action-token.model";
import { AuthTokenService } from "../../services/auth-token.service";
import { UNIT_OF_WORK } from "src/modules/shared/application/constant/unit-of-work.constant";
import { IUnitOfWork } from "src/modules/shared/application/interfaces/unit-of-work.interface";
import { UserFinderService } from "src/modules/user/application/services/user-finder.service";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { ActionTokenVerifierService } from "../../services/action-token-verifier.service";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly actionTokenVerifierService: ActionTokenVerifierService,
    private readonly authTokenService: AuthTokenService,
    private readonly actionTokenService: ActionTokenService,
    private readonly userFinderService: UserFinderService,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: IUnitOfWork,
  ) {}

  private async rotateCurrentRefreshToken(actionToken: ActionTokenModel, user: UserModel): Promise<ActionTokenModel> {
    return this.unitOfWork.transaction(async (manager) => {
      await this.actionTokenService.revoke(actionToken, manager);
      return this.authTokenService.generateRefreshToken(user, manager);
    })
  }

  async execute(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    const refreshTokenModel = await this.actionTokenVerifierService.verifyRefreshToken(refreshToken);
    const user = await this.userFinderService.getById(refreshTokenModel.userId);
    const accessTokenModel = await this.authTokenService.generateAccessToken(user);
    const rotatedRefreshTokenModel = await this.rotateCurrentRefreshToken(refreshTokenModel, user);
    return {
      accessToken: accessTokenModel.token,
      refreshToken: rotatedRefreshTokenModel.token,
    }
  }
}