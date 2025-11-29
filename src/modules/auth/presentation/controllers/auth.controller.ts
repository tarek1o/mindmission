import { Body, Controller, Post } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { SignupUseCase } from "../../application/use-cases/signup/signup.use-case";
import { SignupDto } from "../dto/request/signup.dto";
import { CompleteSignupUseCase } from "../../application/use-cases/signup/complete-sign-up.use-case";
import { CompleteSignupDto } from "../dto/request/complete-signup.dto";
import { LoginUseCase } from "../../application/use-cases/login/login.use-case";
import { LoginDto } from "../dto/request/login.dto";
import { LogoutUseCase } from "../../application/use-cases/logout/logout.use-case";
import { LogoutDto } from "../dto/request/logout.dto";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token/refresh-token.use-case";
import { RefreshTokenDto } from "../dto/request/refresh-token.dto";
import { configService } from "src/infrastructure/configuration/services/config-instance.service";
import { AppUi } from "src/modules/shared/presentation/decorators/app-ui.decorator";
import { AppUiEnum } from "src/modules/shared/domain/enums/app-ui.enum";

@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly completeSignupUseCase: CompleteSignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post("signup")
  signup(@Body() signupDto: SignupDto): Promise<void> {
    return this.signupUseCase.execute(signupDto);
  }

  @Post("signup/complete")
  completeSignup(@Body() completeSignupDto: CompleteSignupDto): Promise<void> {
    return this.completeSignupUseCase.execute(completeSignupDto);
  }

  @Post("login")
  @Throttle({ default: { limit: configService.getNumber('LOGIN_RATE_LIMITER_DEFAULT_LIMIT'), ttl: configService.getNumber('LOGIN_RATE_LIMITER_DEFAULT_TTL') } })
  login(
    @AppUi() appUi: AppUiEnum,
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string, refreshToken: string }> {
    return this.loginUseCase.execute(appUi, loginDto);
  }
  
  @Post("logout")
  logout(@Body() logoutDto: LogoutDto): Promise<void> {
    return this.logoutUseCase.execute(logoutDto.refreshToken);
  }
  
  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string, refreshToken: string }> {
    return this.refreshTokenUseCase.execute(refreshTokenDto.refreshToken);
  }
}