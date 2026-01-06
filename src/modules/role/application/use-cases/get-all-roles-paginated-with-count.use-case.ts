import { Inject, Injectable } from '@nestjs/common';
import { ROLE_REPOSITORY } from '../constants/role-repository.constant';
import { IRoleRepository } from '../interfaces/role-repository.interface';
import { GetAllRoleQueryInput } from '../inputs/get-all-role-query.input';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { AllowedRoleOrderColumnsEnum } from '../enums/allowed-role-order-columns.enum';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { GetAllRolesByLanguageViewModel } from '../view-models/get-all-roles-by-language.view-model';

@Injectable()
export class GetAllRolesPaginatedWithCountUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
  ) {}

  execute(
    query: GetAllRoleQueryInput,
    order: IOrder<AllowedRoleOrderColumnsEnum>,
    pagination: Pagination,
  ): Promise<{ models: GetAllRolesByLanguageViewModel[]; count: number }> {
    return this.roleRepository.getAllPaginatedAndTotalCount(
      query,
      order,
      pagination,
    );
  }
}
