import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { I18nResolver } from 'nestjs-i18n';
import { ModuleRef } from '@nestjs/core';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { GraphqlLanguageResolver } from './graphql-language.resolver';
import { RestfulLanguageResolver } from '../restful-language.resolver';

@Injectable()
export class LanguageResolver implements I18nResolver {
  private readonly languageResolverMap: Record<GqlContextType, string> = {
    graphql: GraphqlLanguageResolver.name,
    http: RestfulLanguageResolver.name,
    ws: undefined,
    rpc: undefined,
  };

  constructor(
    private readonly moduleRef: ModuleRef,
  ) {}

  resolve(context: ExecutionContext): LanguageEnum {
    const type: GqlContextType = context.getType();
    const languageResolverName = this.languageResolverMap[type];
    if (languageResolverName) {
      const languageResolver = this.moduleRef.get<I18nResolver>(languageResolverName, { strict: false });
      return languageResolver.resolve(context) as LanguageEnum;
    }
    return LanguageEnum.ENGLISH;
  }
}
