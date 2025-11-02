import { IsString, IsNotEmpty } from "class-validator";

export class VerifyResetPasswordTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}