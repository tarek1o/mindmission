import { ObjectType, Field } from '@nestjs/graphql';
import { PermissionTranslationModel } from 'src/modules/permission/domain/models/permission-translation.model';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import '../enums/language.enum';

@ObjectType()
export class PermissionTranslationType {
  @Field(() => LanguageEnum)
  language: LanguageEnum;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  constructor(permissionTranslationModel: PermissionTranslationModel) {
    this.language = permissionTranslationModel.language;
    this.name = permissionTranslationModel.name;
    this.description = permissionTranslationModel.description;
  }
}

