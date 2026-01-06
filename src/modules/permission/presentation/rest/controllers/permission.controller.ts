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
} from '@nestjs/common';
import { GetAllPermissionsPaginatedWithCountUseCase } from 'src/modules/permission/application/use-cases/get-all-permissions-paginated-with-count.use-case';
import { GetPermissionTranslationsByLanguageUseCase } from 'src/modules/permission/application/use-cases/get-permission-translations-by-language.use-case';
import { GetPermissionWithTranslationsByIdUseCase } from 'src/modules/permission/application/use-cases/get-permission-with-translations-by-id.use-case';
import { CreatePermissionUseCase } from 'src/modules/permission/application/use-cases/create-permission.use-case';
import { UpdatePermissionUseCase } from 'src/modules/permission/application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from 'src/modules/permission/application/use-cases/delete-permission.use-case';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';
import { AcceptLanguage } from 'src/infrastructure/localization/decorator/accept-language.decorator';
import { GetAllPermissionQueryDto } from '../dto/request/get-all-permission-query.dto';
import { PermissionOrderDto } from '../dto/request/permission-order.dto';
import { PaginationPipe } from 'src/modules/shared/presentation/pipes/pagination.pipe';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { PermissionDetailsResponseDto } from '../dto/response/permission-details.response.dto';
import { CreatePermissionDto } from '../dto/request/create-permission.dto';
import { UpdatePermissionDto } from '../dto/request/update-permission.dto';
import { PermissionTranslationListResponseDto } from '../dto/response/permission-list.response.dto';
import { PermissionResponseDto } from '../dto/response/permission.response.dto';
import { AcceptedCriteria } from 'src/modules/shared/presentation/decorators/privileges.decorator';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';

@Controller({ path: 'permissions', version: '1' })
export class PermissionController {
  constructor(
    private readonly getAllPermissionsUseCase: GetAllPermissionsPaginatedWithCountUseCase,
    private readonly getPermissionTranslationsByLanguageUseCase: GetPermissionTranslationsByLanguageUseCase,
    private readonly getPermissionByIdUseCase: GetPermissionWithTranslationsByIdUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Get()
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.PERMISSIONS,
        actions: [ActionEnum.LIST, ActionEnum.SEARCH],
      },
    ],
  })
  async getAllPermissions(
    @AcceptLanguage() language: LanguageEnum,
    @Query() searchQuery: GetAllPermissionQueryDto,
    @Query() order: PermissionOrderDto,
    @Query(PaginationPipe) pagination: Pagination,
  ): Promise<{ data: PermissionResponseDto[]; count: number }> {
    const { models, count } = await this.getAllPermissionsUseCase.execute(
      { ...searchQuery, language },
      order,
      pagination,
    );
    return {
      data: models.map((permission) => new PermissionResponseDto(permission)),
      count,
    };
  }

  @Get('list')
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.ROLES,
        actions: [ActionEnum.LIST, ActionEnum.SEARCH],
      },
    ],
  })
  async getByLanguage(
    @AcceptLanguage() language: LanguageEnum,
  ): Promise<PermissionTranslationListResponseDto[]> {
    const permissionTranslationModels =
      await this.getPermissionTranslationsByLanguageUseCase.execute(language);
    return permissionTranslationModels.map(
      (model) => new PermissionTranslationListResponseDto(model),
    );
  }

  @Get(':id')
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.PERMISSIONS,
        actions: [ActionEnum.LIST, ActionEnum.SEARCH],
      },
    ],
  })
  async getPermissionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PermissionDetailsResponseDto> {
    const permission = await this.getPermissionByIdUseCase.execute(id);
    return new PermissionDetailsResponseDto(permission);
  }

  @Post()
  @AcceptedCriteria({
    privileges: [
      { resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.ADD] },
    ],
  })
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDetailsResponseDto> {
    const createdPermission =
      await this.createPermissionUseCase.execute(createPermissionDto);
    return new PermissionDetailsResponseDto(createdPermission);
  }

  @Patch(':id')
  @AcceptedCriteria({
    privileges: [
      { resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.EDIT] },
    ],
  })
  async updatePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDetailsResponseDto> {
    const updatedPermission = await this.updatePermissionUseCase.execute(
      id,
      updatePermissionDto,
    );
    return new PermissionDetailsResponseDto(updatedPermission);
  }

  @Delete(':id')
  @AcceptedCriteria({
    privileges: [
      { resource: ResourceEnum.PERMISSIONS, actions: [ActionEnum.DELETE] },
    ],
  })
  async deletePermission(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deletePermissionUseCase.execute(id);
  }
}
