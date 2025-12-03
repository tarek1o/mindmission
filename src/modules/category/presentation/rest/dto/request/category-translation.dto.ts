import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CategoryTranslationInput } from 'src/modules/category/application/inputs/category-translation.input';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export class CategoryTranslationDto implements CategoryTranslationInput {
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
