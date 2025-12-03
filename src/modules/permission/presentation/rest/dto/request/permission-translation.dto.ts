import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PermissionTranslationInput } from 'src/modules/permission/application/inputs/permission-translation.input';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export class PermissionTranslationDto implements PermissionTranslationInput {
  @IsEnum(LanguageEnum)
  @IsNotEmpty()
  language: LanguageEnum;

  @MaxLength(60)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(2000)
  @IsString()
  @IsOptional()
  description?: string;
}
