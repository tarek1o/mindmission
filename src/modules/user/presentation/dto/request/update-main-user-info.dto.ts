import { IsOptional, IsString } from "class-validator";
import { UpdateMainUserInfoInput } from "src/modules/user/application/inputs/update-main-user-info.input";

export class UpdateMainUserInfoDto implements UpdateMainUserInfoInput {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  whatsAppNumber?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}