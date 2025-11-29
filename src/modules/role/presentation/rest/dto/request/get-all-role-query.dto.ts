import { IsOptional, IsString } from 'class-validator';

export class GetAllPermissionQueryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
