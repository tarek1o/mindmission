import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

@ValidatorConstraint()
export class ValidateArabicAndEnglishTranslationsExistValidator implements ValidatorConstraintInterface {
  validate(
    translations: any[],
    validationArguments?: ValidationArguments,
  ): boolean {
    const languages = translations?.map((t) => t.language) ?? [];
    return (
      languages.includes(LanguageEnum.ENGLISH) &&
      languages.includes(LanguageEnum.ARABIC)
    );
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return i18nValidationMessage('errors.permission.translations.missing')(
      validationArguments,
    );
  }
}
