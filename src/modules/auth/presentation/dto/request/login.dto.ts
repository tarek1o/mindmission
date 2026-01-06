import { IsNotEmpty, IsString } from 'class-validator';
import { LoginInput } from 'src/modules/auth/application/inputs/login.input';

export class LoginDto implements LoginInput {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
