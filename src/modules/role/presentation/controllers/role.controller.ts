import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetAllRolesPaginatedWithCountUseCase } from '../../application/use-cases/get-all-roles-paginated-with-count.use-case';
import { GetRoleWithTranslationsByIdUseCase } from '../../application/use-cases/get-role-with-translations-by-id.use-case';
import { GetRoleTranslationsByLanguageUseCase } from '../../application/use-cases/get-role-translations-by-language.use-case';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '../../application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '../../application/use-cases/delete-role.use-case';
import { AcceptLanguage } from 'src/infrastructure/localization/decorator/accept-language.decorator';
import { LanguageEnum } from '../../../shared/domain/enums/language.enum';
import { PermissionOrderDto } from '../dto/request/role-order.dto';
import { GetAllPermissionQueryDto } from '../dto/request/get-all-role-query.dto';
import { PaginationPipe } from 'src/modules/shared/presentation/pipes/pagination.pipe';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { CreateRoleDto } from '../dto/request/create-role.dto';
import { UpdateRoleDto } from '../dto/request/update-role.dto';
import { RoleDetailsResponseDto } from '../dto/response/role-details.response.dto';
import { RoleListResponseDto } from '../dto/response/role-list.response';
import { RoleResponseDto } from '../dto/response/role.response.dto';
import { AuthorizationGuard } from 'src/modules/shared/presentation/guards/authorization.guard';
import { AcceptedCriteria } from 'src/modules/shared/presentation/decorators/privileges.decorator';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';

@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(
    private readonly getAllRolesUseCase: GetAllRolesPaginatedWithCountUseCase,
    private readonly getRoleTranslationsByLanguageUseCase: GetRoleTranslationsByLanguageUseCase,
    private readonly getRoleByIdUseCase: GetRoleWithTranslationsByIdUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.ROLES, actions: [ActionEnum.LIST, ActionEnum.SEARCH]} ] })
  async getAllRoles(
    @AcceptLanguage() language: LanguageEnum,
    @Query() searchQuery: GetAllPermissionQueryDto,
    @Query() order: PermissionOrderDto,
    @Query(PaginationPipe) pagination: Pagination,
  ): Promise<{ data: RoleResponseDto[]; count: number }> {
    const { models, count } = await this.getAllRolesUseCase.execute({ ...searchQuery, language }, order, pagination);
    return {
      data: models.map((role) => new RoleResponseDto(role)),
      count,
    };
  }

  @Get('list')
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.USER_ROLES, actions: [ActionEnum.LIST, ActionEnum.SEARCH]} ] })
  async getByLanguage(
    @AcceptLanguage() language: LanguageEnum
  ): Promise<RoleListResponseDto[]> {
    const roleTranslationModels = await this.getRoleTranslationsByLanguageUseCase.execute(language);
    return roleTranslationModels.map((RoleTranslationModel) => new RoleListResponseDto(RoleTranslationModel));
  }

  @Get(':id')
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.ROLES, actions: [ActionEnum.LIST, ActionEnum.SEARCH]} ] })
  async getRoleById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<RoleDetailsResponseDto> {
    const role = await this.getRoleByIdUseCase.execute(id);
    return new RoleDetailsResponseDto(role);
  }

  @Post()
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.ROLES, actions: [ActionEnum.ADD]} ] })
  async createRole(
    @Body() createRoleDto: CreateRoleDto
  ): Promise<RoleDetailsResponseDto> {
    const createdRole = await this.createRoleUseCase.execute(createRoleDto);
    return new RoleDetailsResponseDto(createdRole);
  }

  @Patch(':id')
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.ROLES, actions: [ActionEnum.EDIT]} ] })
  async updateRole(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleDetailsResponseDto> {
    const updatedRole = await this.updateRoleUseCase.execute(id, updateRoleDto);
    return new RoleDetailsResponseDto(updatedRole);
  }

  @Delete(':id')
  @AcceptedCriteria({ privileges: [ {resource: ResourceEnum.ROLES, actions: [ActionEnum.DELETE]} ] })
  async deleteRole(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    await this.deleteRoleUseCase.execute(id);
  }
}
