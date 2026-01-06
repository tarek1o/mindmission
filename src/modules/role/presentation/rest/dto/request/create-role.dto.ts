import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoleInput } from 'src/modules/role/application/inputs/role.input';
import { RoleTranslationDto } from './role-translation.dto';
import { ValidateArabicAndEnglishTranslationsExistValidator } from 'src/modules/shared/presentation/validators/validate-arabic-and-english-translations-exist.validator';

export class CreateRoleDto implements RoleInput {
  @Validate(ValidateArabicAndEnglishTranslationsExistValidator)
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @IsArray()
  @Type(() => RoleTranslationDto)
  @IsNotEmpty()
  translations: RoleTranslationDto[];

  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  permissionIds: number[];
}
