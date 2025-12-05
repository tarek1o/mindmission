import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';

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

  constructor(paginationInput: Pagination, totalCount: number) {
    this.skip = paginationInput.skip;
    this.take = paginationInput.take;
    this.totalCount = totalCount;
    this.page = paginationInput.currentPage;
    this.pages = Math.ceil(totalCount / paginationInput.take);
  }
}

