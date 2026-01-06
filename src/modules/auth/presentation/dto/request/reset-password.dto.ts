import { IsString, IsNotEmpty } from 'class-validator';
import { ResetPasswordInput } from 'src/modules/auth/application/inputs/reset-password.input';

export class ResetPasswordDto implements ResetPasswordInput {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
