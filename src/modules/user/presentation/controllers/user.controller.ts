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
import { GetAllUsersPaginatedWithCountUseCase } from '../../application/use-cases/get-all-users-paginated-with-count.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetAllUsersQueryDto } from '../dto/request/get-all-users-query.dto';
import { UserOrderDto } from '../dto/request/user-order.dto';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { PaginationPipe } from 'src/modules/shared/presentation/pipes/pagination.pipe';
import { UserListItemResponseDto } from '../dto/response/user-list-item.response.dto';
import { UserDetailsResponseDto } from '../dto/response/user-details.response.dto';
import { CreateAdminUseCase } from '../../application/use-cases/create-admin.use.case';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { UpdateUserRolesUseCase } from '../../application/use-cases/update-user-roles.use-case';
import { UpdateUserRolesDto } from '../dto/request/update-user-roles.dto';
import { ToggleBlockUserUseCase } from '../../application/use-cases/toggle-block-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { AcceptedCriteria } from 'src/modules/shared/presentation/decorators/privileges.decorator';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(
    private readonly getAllUsersPaginatedWithCountUseCase: GetAllUsersPaginatedWithCountUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly updateUserRolesUseCase: UpdateUserRolesUseCase,
    private readonly toggleBlockUserUseCase: ToggleBlockUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.USERS,
        actions: [ActionEnum.LIST, ActionEnum.SEARCH],
      },
    ],
  })
  async getAllUsersPaginatedWithCount(
    @Query() query: GetAllUsersQueryDto,
    @Query() order: UserOrderDto,
    @Query(PaginationPipe) pagination: Pagination,
  ) {
    const { models, count } =
      await this.getAllUsersPaginatedWithCountUseCase.execute(
        query,
        order,
        pagination,
      );
    return {
      data: models.map((user) => new UserListItemResponseDto(user)),
      count,
    };
  }

  @Get(':id')
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.USERS,
        actions: [ActionEnum.LIST, ActionEnum.SEARCH],
      },
    ],
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.getUserByIdUseCase.execute(id);
    return new UserDetailsResponseDto(user);
  }

  @Post()
  @AcceptedCriteria({
    privileges: [{ resource: ResourceEnum.USERS, actions: [ActionEnum.ADD] }],
  })
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    const user = await this.createAdminUseCase.execute(createUserDto);
    return new UserDetailsResponseDto(user);
  }

  @Patch(':id/roles')
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.USER_ROLES,
        actions: [ActionEnum.ADD, ActionEnum.EDIT],
      },
    ],
  })
  async updateUserRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoles: UpdateUserRolesDto,
  ): Promise<UserDetailsResponseDto> {
    const user = await this.updateUserRolesUseCase.execute(
      id,
      updateUserRoles.rolesIds,
    );
    return new UserDetailsResponseDto(user);
  }

  @Patch(':id/block')
  @AcceptedCriteria({
    privileges: [
      {
        resource: ResourceEnum.BLOCK_USERS,
        actions: [ActionEnum.ADD, ActionEnum.EDIT],
      },
    ],
  })
  async toggleBlockUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.toggleBlockUserUseCase.execute(id);
  }

  @Delete(':id')
  @AcceptedCriteria({
    privileges: [
      { resource: ResourceEnum.USERS, actions: [ActionEnum.DELETE] },
    ],
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }
}
