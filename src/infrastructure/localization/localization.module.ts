import * as path from 'path';
import { Module } from '@nestjs/common';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { LanguageResolver } from './resolvers/language.resolver';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: LanguageEnum.ENGLISH,
      loader: I18nJsonLoader,
      resolvers: [LanguageResolver],
      loaderOptions: {
        path: path.join(__dirname, '../../i18n/'),
        watch: true,
      },
    }),
  ],
})
export class LocalizationModule {}
