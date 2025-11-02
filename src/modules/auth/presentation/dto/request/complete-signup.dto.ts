import { IsNotEmpty, IsString } from "class-validator";
import { CompleteSignupInput } from "src/modules/auth/application/inputs/complete-signup.input";

export class CompleteSignupDto implements CompleteSignupInput {
  @IsNotEmpty()
  @IsString()
  token: string;
}