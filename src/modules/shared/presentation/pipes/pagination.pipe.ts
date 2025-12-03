import { Injectable, PipeTransform } from '@nestjs/common';
import { Pagination } from '../../application/interfaces/pagination.interface';

@Injectable()
export class PaginationPipe implements PipeTransform<any, Pagination> {
  private readonly skip: number = 0;
  private readonly take: number = 10;

  transform(query: any): Pagination {
    const skip = this.calculateSkip(query);
    const take = this.getTake(query);
    const currentPage = this.getPage(query);
    return {
      skip,
      take,
      currentPage,
    };
  };

  private calculateSkip(query: any) {
    const take = this.getTake(query);
    const pageNo = this.getPage(query);
    const skip = take * (pageNo - 1);
    return skip || this.skip;
  };

  private getTake(query: any) {
    return parseInt(query?.take, 10) || this.take;
  };

  private getPage(query: any) {
    const pageNo = parseInt(query?.page, 10);
    return pageNo && pageNo > 0 ? pageNo : 1;
  };
}