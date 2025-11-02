import { IsNotEmpty, IsString } from "class-validator";
import { ChangePasswordInput } from "src/modules/user/application/inputs/change-password.input";

export class ChangePasswordDto implements ChangePasswordInput {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}