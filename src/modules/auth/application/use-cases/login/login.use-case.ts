import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY } from "src/modules/user/application/constants/user-repository.constant";
import { IUserRepository } from "src/modules/user/application/interfaces/user-repository.interface";
import { LoginInput } from "../../inputs/login.input";
import { PasswordHashingHelper } from "src/modules/shared/application/helpers/password-hashing.helper";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { AuthTokenService } from "../../services/auth-token.service";
import { BusinessRuleViolationError } from "src/modules/shared/domain/errors/business-rule-violation.error";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";
import { LoginViewModel } from "../../view-models/login.view-model";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly authTokenService: AuthTokenService,
  ) {}

  private async validatePassword(user: UserModel, password: string): Promise<void> {
    const isPasswordValid = user ? await PasswordHashingHelper.compare(password, user.password) : false;
    if (!isPasswordValid) {
      throw new BusinessRuleViolationError('auth.login.invalid_credentials');
    }
  }

  private checkIfEmailIsVerified(user: UserModel): void {
    if (!user.isEmailVerified) {
      throw new BusinessRuleViolationError('auth.login.email_not_verified');
    }
  }

  async execute(appUi: AppUiEnum, loginInput: LoginInput): Promise<LoginViewModel> {
    const user = await this.userRepository.getByEmail(loginInput.email, appUi);
    await this.validatePassword(user, loginInput.password);
    this.checkIfEmailIsVerified(user);
    const accessTokenModel = await this.authTokenService.generateAccessToken(user);
    const refreshTokenModel = await this.authTokenService.generateRefreshToken(user);
    return {
      user,
      tokens: {
        accessToken: accessTokenModel.token,
        refreshToken: refreshTokenModel.token,
      },
    }
  }
}