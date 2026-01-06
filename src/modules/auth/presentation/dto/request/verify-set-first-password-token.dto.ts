import { IsString, IsNotEmpty } from 'class-validator';

export class VerifySetFirstPasswordTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
