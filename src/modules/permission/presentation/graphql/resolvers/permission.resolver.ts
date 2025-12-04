import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AcceptLanguage } from "src/infrastructure/localization/decorator/accept-language.decorator";
import { GetAllPermissionsPaginatedWithCountUseCase } from "src/modules/permission/application/use-cases/get-all-permissions-paginated-with-count.use-case";
import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { LanguageEnum } from "src/modules/shared/domain/enums/language.enum";
import { AcceptedCriteria } from "src/modules/shared/presentation/decorators/privileges.decorator";
import { AuthenticationGuard } from "src/modules/shared/presentation/guards/authentication.guard";
import { AuthorizationGuard } from "src/modules/shared/presentation/guards/authorization.guard";
import { PaginationPipe } from "src/modules/shared/presentation/pipes/pagination.pipe";
import { GetAllPermissionQueryInput } from "../inputs/get-all-permission-query.input";
import { PermissionsResponseType } from "../types/permission-response.type";
import { PaginationInput } from "src/modules/role/presentation/graphql/inputs/pagination.input";
import { PermissionOrderInput } from "../inputs/permission-order.input";
import { PermissionType } from "../types/permission.type";
import { GetPermissionTranslationsByLanguageUseCase } from "src/modules/permission/application/use-cases/get-permission-translations-by-language.use-case";
import { GetPermissionWithTranslationsByIdUseCase } from "src/modules/permission/application/use-cases/get-permission-with-translations-by-id.use-case";
import { CreatePermissionUseCase } from "src/modules/permission/application/use-cases/create-permission.use-case";
import { UpdatePermissionUseCase } from "src/modules/permission/application/use-cases/update-permission.use-case";
import { DeletePermissionUseCase } from "src/modules/permission/application/use-cases/delete-permission.use-case";
import { CreatePermissionInput } from "../inputs/create-permission.input";
import { UpdatePermissionInput } from "../inputs/update-permission.input";
import { PermissionListType } from "../types/permission-list.type";
import { PermissionDetailsType } from "../types/permission-details.type";

@Resolver()
// @UseGuards(AuthenticationGuard, AuthorizationGuard)
export class PermissionResolver {
  constructor(
    private readonly getAllPermissionsUseCase: GetAllPermissionsPaginatedWithCountUseCase,
    private readonly getPermissionsByLanguageUseCase: GetPermissionTranslationsByLanguageUseCase,
    private readonly getPermissionByIdUseCase: GetPermissionWithTranslationsByIdUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Query(() => PermissionsResponseType, { name: 'getAllPermissions' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.LIST, ActionEnum.SEARCH] }] })
  async getAllPermissions(
    @AcceptLanguage() language: LanguageEnum,
    @Args('query', { nullable: true }) queryInput: GetAllPermissionQueryInput,
    @Args('order', { nullable: true }) orderInput: PermissionOrderInput,
    @Args('pagination', { nullable: true, type: () => PaginationInput }, PaginationPipe) pagination: Pagination,
  ): Promise<PermissionsResponseType> {
    const { models, count } = await this.getAllPermissionsUseCase.execute({ ...queryInput, language }, orderInput, pagination);
    return {
      data: models.map(model => new PermissionType(model)),
      // TODO: Add pagination
    };
  }

  @Query(() => [PermissionListType], { name: 'getPermissionsByLanguage' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.LIST, ActionEnum.SEARCH] }] })
  async getPermissionsByLanguage(
    @AcceptLanguage() language: LanguageEnum,
  ): Promise<PermissionListType[]> {
    const permissionTranslationModels = await this.getPermissionsByLanguageUseCase.execute(language);
    return permissionTranslationModels.map(permissionTranslationViewModel => new PermissionListType(permissionTranslationViewModel));
  }

  @Query(() => PermissionDetailsType, { name: 'getPermissionById' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.LIST, ActionEnum.SEARCH] }] })
  async getPermissionById(@Args('id', { type: () => Int }) id: number): Promise<PermissionDetailsType> {
    const permissionViewModel = await this.getPermissionByIdUseCase.execute(id);
    return new PermissionDetailsType(permissionViewModel);
  }

  @Mutation(() => PermissionDetailsType, { name: 'createPermission' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.ADD] }] })
  async createPermission(
    @Args('input') createPermissionInput: CreatePermissionInput,
  ): Promise<PermissionDetailsType> {
    const permissionViewModel = await this.createPermissionUseCase.execute(createPermissionInput);
    return new PermissionDetailsType(permissionViewModel);
  }

  @Mutation(() => PermissionDetailsType, { name: 'updatePermission' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.EDIT] }] })
  async updatePermission(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updatePermissionInput: UpdatePermissionInput,
  ): Promise<PermissionDetailsType> {
    const permissionViewModel = await this.updatePermissionUseCase.execute(id, updatePermissionInput);
    return new PermissionDetailsType(permissionViewModel);
  }

  @Mutation(() => Boolean, { name: 'deletePermission' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.DELETE] }] })
  async deletePermission(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deletePermissionUseCase.execute(id);
    return true;
  }
}