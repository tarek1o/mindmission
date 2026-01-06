import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteChangeEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
