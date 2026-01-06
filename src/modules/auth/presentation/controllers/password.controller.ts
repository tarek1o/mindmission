import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SetFirstPasswordUseCase } from '../../application/use-cases/set-password/set-first-password.use-case';
import { SetFirstPasswordDto } from '../dto/request/set-first-password.dto';
import { VerifySetFirstPasswordTokenUseCase } from '../../application/use-cases/set-password/verify-set-first-password-token.use-case';
import { VerifySetFirstPasswordTokenDto } from '../dto/request/verify-set-first-password-token.dto';
import { ForgetPasswordUseCase } from '../../application/use-cases/forget-password/forget-password.use-case';
import { ForgetPasswordDto } from '../dto/request/forget-password.dto';
import { VerifyResetPasswordTokenUseCase } from '../../application/use-cases/forget-password/verify-reset-password-token.use-case';
import { VerifyResetPasswordTokenDto } from '../dto/request/verify-reset-password-token.dto';
import { ResetPasswordUseCase } from '../../application/use-cases/forget-password/reset-password.use-case';
import { ResetPasswordDto } from '../dto/request/reset-password.dto';
import { configService } from 'src/infrastructure/configuration/services/config-instance.service';
import { AppUi } from 'src/modules/shared/presentation/decorators/app-ui.decorator';
import { AppUiEnum } from 'src/modules/shared/domain/enums/app-ui.enum';
import { ForgetPasswordViewModel } from '../../application/view-models/forget-password.view-model';

@Controller({ path: 'auth/password', version: '1' })
export class PasswordController {
  constructor(
    private readonly verifySetFirstPasswordTokenUseCase: VerifySetFirstPasswordTokenUseCase,
    private readonly setFirstPasswordUseCase: SetFirstPasswordUseCase,
    private readonly forgetPasswordUseCase: ForgetPasswordUseCase,
    private readonly verifyResetPasswordTokenUseCase: VerifyResetPasswordTokenUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('first/verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: configService.getNumber(
        'VERIFY_SET_FIRST_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT',
      ),
      ttl: configService.getNumber(
        'VERIFY_SET_FIRST_PASSWORD_RATE_LIMITER_DEFAULT_TTL',
      ),
    },
  })
  async verifySetPasswordToken(
    @Body() verifySetPasswordTokenDto: VerifySetFirstPasswordTokenDto,
  ): Promise<void> {
    await this.verifySetFirstPasswordTokenUseCase.execute(
      verifySetPasswordTokenDto.token,
    );
  }

  @Patch('first/set')
  setPassword(@Body() setFirstPasswordDto: SetFirstPasswordDto): Promise<void> {
    return this.setFirstPasswordUseCase.execute(setFirstPasswordDto);
  }

  @Post('forget')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: configService.getNumber(
        'FORGET_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT',
      ),
      ttl: configService.getNumber('FORGET_PASSWORD_RATE_LIMITER_DEFAULT_TTL'),
    },
  })
  forgetPassword(
    @AppUi() appUi: AppUiEnum,
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<ForgetPasswordViewModel> {
    return this.forgetPasswordUseCase.execute(appUi, forgetPasswordDto.email);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @Throttle({
    default: {
      limit: configService.getNumber(
        'VERIFY_RESET_PASSWORD_RATE_LIMITER_DEFAULT_LIMIT',
      ),
      ttl: configService.getNumber(
        'VERIFY_RESET_PASSWORD_RATE_LIMITER_DEFAULT_TTL',
      ),
    },
  })
  verifyResetPasswordToken(
    @Body() verifyResetPasswordTokenDto: VerifyResetPasswordTokenDto,
  ): Promise<void> {
    return this.verifyResetPasswordTokenUseCase.execute(
      verifyResetPasswordTokenDto.token,
    );
  }

  @Patch('reset')
  resetPasswordToken(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.resetPasswordUseCase.execute(resetPasswordDto);
  }
}
