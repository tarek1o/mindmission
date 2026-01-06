import { registerEnumType } from '@nestjs/graphql';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

registerEnumType(LanguageEnum, {
  name: 'LanguageEnum',
  description: 'Supported languages',
});
