import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GetAllRolesPaginatedWithCountUseCase } from '../../../application/use-cases/get-all-roles-paginated-with-count.use-case';
import { GetRoleWithTranslationsByIdUseCase } from '../../../application/use-cases/get-role-with-translations-by-id.use-case';
import { GetRoleTranslationsByLanguageUseCase } from '../../../application/use-cases/get-role-translations-by-language.use-case';
import { CreateRoleUseCase } from '../../../application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '../../../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../../../application/use-cases/delete-role.use-case';
import { LanguageEnum } from '../../../../shared/domain/enums/language.enum';
import { AuthorizationGuard } from 'src/modules/shared/presentation/guards/authorization.guard';
import { AcceptedCriteria } from 'src/modules/shared/presentation/decorators/privileges.decorator';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import '../enums/language.enum';
import '../enums/allowed-role-order-columns.enum';
import '../enums/order-direction.enum';
import { RoleType } from '../types/role.type';
import { RoleDetailsType } from '../types/role-details.type';
import { RoleListType } from '../types/role-list.type';
import { RolesResponseType } from '../types/roles-response.type';
import { CreateRoleInput } from '../inputs/create-role.input';
import { UpdateRoleInput } from '../inputs/update-role.input';
import { GetAllRolesQueryInput } from '../inputs/get-all-roles-query.input';
import { RoleOrderInput } from '../inputs/role-order.input';
import { PaginationInput } from '../inputs/pagination.input';
import { AcceptLanguage } from 'src/infrastructure/localization/decorator/accept-language.decorator';
import { PaginationPipe } from 'src/modules/shared/presentation/pipes/pagination.pipe';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { AuthenticationGuard } from 'src/modules/shared/presentation/guards/authentication.guard';

@Resolver(() => RoleType)
@UseGuards(AuthenticationGuard)
export class RoleResolver {
  constructor(
    private readonly getAllRolesUseCase: GetAllRolesPaginatedWithCountUseCase,
    private readonly getRoleTranslationsByLanguageUseCase: GetRoleTranslationsByLanguageUseCase,
    private readonly getRoleByIdUseCase: GetRoleWithTranslationsByIdUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Query(() => RolesResponseType, { name: 'getAllRoles' })
  @UseGuards(AuthorizationGuard)
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.ROLES, actions: [ActionEnum.LIST, ActionEnum.SEARCH] }] })
  async getAllRoles(
    @AcceptLanguage() language: LanguageEnum,
    @Args('query', { nullable: true }) queryInput: GetAllRolesQueryInput,
    @Args('order', { nullable: true }) orderInput: RoleOrderInput,
    @Args('pagination', { nullable: true, type: () => PaginationInput }, PaginationPipe) paginationInput: Pagination,
  ): Promise<RolesResponseType> {
    const { models, count } = await this.getAllRolesUseCase.execute(
      { ...queryInput, language },
      orderInput,
      paginationInput,
    );
    return {
      data: models.map(model => new RoleType(model)),
      count,
    };
  }

  @Query(() => [RoleListType], { name: 'getRolesByLanguage' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.USER_ROLES, actions: [ActionEnum.LIST, ActionEnum.SEARCH] }] })
  async getRolesByLanguage(
    @AcceptLanguage() language: LanguageEnum,
  ): Promise<RoleListType[]> {
    const roleTranslationModels = await this.getRoleTranslationsByLanguageUseCase.execute(language);
    return roleTranslationModels.map(roleTranslationViewModel => new RoleListType(roleTranslationViewModel));
  }

  @Query(() => RoleDetailsType, { name: 'getRoleById' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.ROLES, actions: [ActionEnum.LIST, ActionEnum.SEARCH] }] })
  async getRoleById(@Args('id', { type: () => Int }) id: number): Promise<RoleDetailsType> {
    const roleViewModel = await this.getRoleByIdUseCase.execute(id);
    return new RoleDetailsType(roleViewModel);
  }

  @Mutation(() => RoleDetailsType, { name: 'createRole' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.ROLES, actions: [ActionEnum.ADD] }] })
  async createRole(
    @Args('input') createRoleInput: CreateRoleInput,
  ): Promise<RoleDetailsType> {
    const roleViewModel = await this.createRoleUseCase.execute(createRoleInput);
    return new RoleDetailsType(roleViewModel);
  }

  @Mutation(() => RoleDetailsType, { name: 'updateRole' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.ROLES, actions: [ActionEnum.EDIT] }] })
  async updateRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') updateRoleInput: UpdateRoleInput,
  ): Promise<RoleDetailsType> {
    const roleViewModel = await this.updateRoleUseCase.execute(id, updateRoleInput);
    return new RoleDetailsType(roleViewModel);
  }

  @Mutation(() => Boolean, { name: 'deleteRole' })
  @AcceptedCriteria({ privileges: [{ resource: ResourceEnum.ROLES, actions: [ActionEnum.DELETE] }] })
  async deleteRole(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteRoleUseCase.execute(id);
    return true;
  }
}

