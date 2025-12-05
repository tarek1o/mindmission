import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GetRoleTranslationByLanguageViewModel } from 'src/modules/role/application/view-models/get-role-translation-by-language.view-model';

@ObjectType()
export class RoleListType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  constructor(roleTranslationViewModel: GetRoleTranslationByLanguageViewModel) {
    this.id = roleTranslationViewModel.roleId;
    this.name = roleTranslationViewModel.name;
  }
}

