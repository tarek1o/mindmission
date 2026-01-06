import { IsArray, IsInt, IsNotEmpty, Min, ArrayMinSize } from 'class-validator';

export class UpdateUserRolesDto {
  @Min(1, { each: true })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  rolesIds: number[];
}
