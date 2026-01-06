import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/modules/shared/presentation/decorators/to-boolean.decorator';
import { GetAllUsersQueryInput } from 'src/modules/user/application/inputs/get-all-users-query.input';
import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';

export class GetAllUsersQueryDto implements GetAllUsersQueryInput {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(UserTypeEnum)
  @IsOptional()
  type?: UserTypeEnum;

  @IsString()
  @IsOptional()
  mobilePhone?: string;

  @IsString()
  @IsOptional()
  whatsAppNumber?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isProtected?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
