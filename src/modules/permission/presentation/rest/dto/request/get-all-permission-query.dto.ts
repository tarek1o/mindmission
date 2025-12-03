import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';

export class GetAllPermissionQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(ResourceEnum)
  @IsOptional()
  resource?: ResourceEnum;
}
