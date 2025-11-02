import { Inject, Injectable } from "@nestjs/common";
import { PERMISSION_REPOSITORY } from "../constants/permission-repository.constant";
import { IPermissionRepository } from "../interfaces/permission-repository.interface";
import { GetAllPermissionQueryInput } from "../inputs/get-all-permission-query.input";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { AllowedPermissionOrderColumnEnum } from "../enums/allowed-permission-order-columns.enum";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";

@Injectable()
export class GetAllPermissionsPaginatedWithCountUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY) private readonly permissionRepository: IPermissionRepository,
  ) {}

  execute(query: GetAllPermissionQueryInput, order: IOrder<AllowedPermissionOrderColumnEnum>, pagination: Pagination) {
    return this.permissionRepository.getAllPaginatedAndTotalCount(query, order, pagination);
  }
}