import { IsString, IsNotEmpty } from 'class-validator';
import { SetFirstPasswordInput } from 'src/modules/auth/application/inputs/set-first-password.input';

export class SetFirstPasswordDto implements SetFirstPasswordInput {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
