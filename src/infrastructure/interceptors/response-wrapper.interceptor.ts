import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { map, Observable } from 'rxjs';
import { IResponseWrapper } from '../interfaces/response-wrapper.interface';
import { PaginationPipe } from 'src/modules/shared/presentation/pipes/pagination.pipe';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    const { query, statusCode: status } = gqlCtx.getContext().req;

    return next.handle().pipe(
      map((response: IResponseWrapper<any>) => this.wrapResponse<any>(status, query, response))
    );
  }

  private wrapResponse<T>(status: HttpStatus, query, response: IResponseWrapper<T>) {
    const pagination = this.buildPagination(query, response?.count);
    return {
      status,
      message: response?.message,
      data: response?.data ?? response ?? null,
      pagination
    }
  }
  
  private buildPagination(query, count?: number) {
    if(count !== undefined) {
      const { skip, take, currentPage } = new PaginationPipe().transform(query);
      const pages = Math.ceil(count / take) || 1;
      return {
        skip,
        take,
        totalCount: count,
        page: currentPage,
        pages
      }
    }
  }
}
