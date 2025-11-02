import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleTranslationInput } from 'src/modules/role/application/inputs/role-translation.input';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export class RoleTranslationDto implements RoleTranslationInput {
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
