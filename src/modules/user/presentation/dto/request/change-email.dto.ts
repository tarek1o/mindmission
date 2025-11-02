import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ChangeEmailInput } from "src/modules/user/application/inputs/change-email.input";

export class ChangeEmailDto implements ChangeEmailInput {
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}