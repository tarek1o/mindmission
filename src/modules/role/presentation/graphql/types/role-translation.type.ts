import { ObjectType, Field } from '@nestjs/graphql';
import { RoleTranslationModel } from 'src/modules/role/domain/models/role-translation.model';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

@ObjectType()
export class RoleTranslationType {
  @Field(() => String)
  language: LanguageEnum;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  constructor(translation: RoleTranslationModel) {
    this.language = translation.language;
    this.name = translation.name;
    this.description = translation.description;
  }
}

