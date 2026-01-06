import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetAllRolesQueryInput {
  @Field(() => String, { nullable: true })
  name?: string;
}
