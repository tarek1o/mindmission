import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GetPermissionTranslationByLanguageViewModel } from 'src/modules/permission/application/view-models/get-permission-translation-by-language.view-model';

@ObjectType()
export class PermissionListType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  constructor(permissionTranslationViewModel: GetPermissionTranslationByLanguageViewModel) {
    this.id = permissionTranslationViewModel.permissionId;
    this.name = permissionTranslationViewModel.name;
  }
}

