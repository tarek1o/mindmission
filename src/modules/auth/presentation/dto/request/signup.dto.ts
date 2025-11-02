import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SignupInput } from "src/modules/auth/application/inputs/signup.input";

export class SignupDto implements SignupInput {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  mobilePhone?: string;

  @IsString()
  @IsOptional()
  whatsAppNumber?: string;
}