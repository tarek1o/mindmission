import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationType {
  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pages: number;
}

