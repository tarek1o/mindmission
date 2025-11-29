import * as path from 'path';
import { Module } from '@nestjs/common';
import { I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { LanguageResolver } from './resolvers/strategies/language.resolver';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { RestfulLanguageResolver } from './resolvers/restful-language.resolver';
import { GraphqlLanguageResolver } from './resolvers/strategies/graphql-language.resolver';

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
  providers: [
    {
      provide: RestfulLanguageResolver.name,
      useClass: RestfulLanguageResolver,
    },
    {
      provide: GraphqlLanguageResolver.name,
      useClass: GraphqlLanguageResolver,
    }
  ]
})
export class LocalizationModule {}
