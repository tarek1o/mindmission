import { IsNotEmpty, IsString } from "class-validator";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { I18nProps } from "src/modules/shared/domain/interfaces/i18n-props.interface";

export class I18nDto implements I18nProps {
  @IsString()
  @IsNotEmpty()
  [LanguageEnum.ENGLISH]: string;

  @IsString()
  @IsNotEmpty()
  [LanguageEnum.ARABIC]: string;
}