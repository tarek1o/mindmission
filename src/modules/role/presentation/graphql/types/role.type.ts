import { ObjectType, Field } from '@nestjs/graphql';
import { GetAllRolesByLanguageViewModel } from 'src/modules/role/application/view-models/get-all-roles-by-language.view-model';

@ObjectType()
export class RoleType {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Boolean)
  isDeletable: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updateAt: Date;

  constructor(roleViewModel: GetAllRolesByLanguageViewModel) {
    this.id = roleViewModel.id;
    this.name = roleViewModel.name;
    this.description = roleViewModel.description;
    this.isDeletable = roleViewModel.isDeletable;
    this.createdAt = roleViewModel.createdAt;
    this.updateAt = roleViewModel.updatedAt;
  }
}

