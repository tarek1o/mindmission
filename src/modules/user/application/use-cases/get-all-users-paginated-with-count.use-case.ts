import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { USER_REPOSITORY } from '../constants/user-repository.constant';
import { GetAllUsersQueryInput } from '../inputs/get-all-users-query.input';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { AllowedUserOrderColumnsEnum } from '../enums/allowed-user-order-columns.enum';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';

@Injectable()
export class GetAllUsersPaginatedWithCountUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  execute(
    query: GetAllUsersQueryInput,
    order: IOrder<AllowedUserOrderColumnsEnum>,
    pagination: Pagination,
  ) {
    return this.userRepository.getAllPaginatedWithTotalCount(
      query,
      order,
      pagination,
    );
  }
}
