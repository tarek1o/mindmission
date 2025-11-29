import { InputType, Field, Int } from '@nestjs/graphql';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';

@InputType()
export class PaginationInput implements Pagination {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  take: number;
}

