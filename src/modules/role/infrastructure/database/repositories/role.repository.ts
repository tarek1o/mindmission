import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsOrder,
  In,
  IsNull,
  Like,
  Repository,
} from 'typeorm';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { IRoleRepository } from '../../../application/interfaces/role-repository.interface';
import { GetAllRoleQueryInput } from '../../../application/inputs/get-all-role-query.input';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { AllowedRoleOrderColumnsEnum } from 'src/modules/role/application/enums/allowed-role-order-columns.enum';
import { GetAllRolesByLanguageViewModel } from 'src/modules/role/application/view-models/get-all-roles-by-language.view-model';
import { RoleEntity } from '../entities/role.entity';
import { RoleModel } from '../../../domain/models/role.model';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { RoleMapper } from '../mappers/role.mapper';
import { SlugifyHelper } from 'src/modules/shared/infrastructure/helpers/slugify.helper';
import { RoleTranslationMapper } from '../mappers/role-translation.mapper';
import { RoleWithTranslationsViewModel } from 'src/modules/role/application/view-models/role-with-translations.view-model';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  private buildOrderQuery(
    order: IOrder<AllowedRoleOrderColumnsEnum>,
  ): FindOptionsOrder<RoleEntity> {
    const orderKeyColumnsMap: Record<
      AllowedRoleOrderColumnsEnum,
      FindOptionsOrder<RoleEntity>
    > = {
      [AllowedRoleOrderColumnsEnum.ID]: {
        id: order.orderDirection,
      },
      [AllowedRoleOrderColumnsEnum.NAME]: {
        translations: {
          name: order.orderDirection,
        },
      },
      [AllowedRoleOrderColumnsEnum.CREATED_AT]: {
        createdAt: order.orderDirection,
      },
      [AllowedRoleOrderColumnsEnum.UPDATED_AT]: {
        updatedAt: order.orderDirection,
      },
    };
    return orderKeyColumnsMap[order.orderBy];
  }

  async getAllPaginatedAndTotalCount(
    query: GetAllRoleQueryInput,
    order: IOrder<AllowedRoleOrderColumnsEnum>,
    pagination: Pagination,
  ): Promise<{ models: GetAllRolesByLanguageViewModel[]; count: number }> {
    const { language, name } = query;
    const [entities, count] = await this.roleRepository.findAndCount({
      where: {
        translations: {
          language,
          slug: name ? Like(`%${SlugifyHelper.slugify(name)}%`) : undefined,
        },
      },
      relations: {
        translations: true,
      },
      select: {
        id: true,
        translations: {
          name: true,
          description: true,
        },
        arePermissionsEditable: true,
        isDeletable: true,
        createdAt: true,
        updatedAt: true,
      },
      order: this.buildOrderQuery(order),
      skip: pagination.skip,
      take: pagination.take,
    });
    return {
      models: entities.map((entity) =>
        this.mapToGetAllRolesByLanguageViewModel(entity),
      ),
      count,
    };
  }

  private mapToGetAllRolesByLanguageViewModel(
    entity: RoleEntity,
  ): GetAllRolesByLanguageViewModel {
    return {
      id: entity.id,
      name: entity.translations[0].name,
      description: entity.translations[0].description,
      isDeletable: entity.isDeletable,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async getById(id: number): Promise<RoleModel | null> {
    const roleEntity = await this.roleRepository.findOne({
      where: { id },
      relations: {
        permissions: true,
      },
    });
    return roleEntity ? RoleMapper.toModel(roleEntity) : null;
  }

  async getByIds(ids: number[]): Promise<RoleModel[]> {
    const roleEntities = await this.roleRepository.find({
      where: { id: In(ids) },
      relations: {
        permissions: true,
      },
    });
    return roleEntities.map((entity) => RoleMapper.toModel(entity));
  }

  async getByIdWithTranslations(
    id: number,
  ): Promise<RoleWithTranslationsViewModel | null> {
    const roleEntity = await this.roleRepository.findOne({
      where: { id },
      relations: {
        translations: true,
        permissions: true,
      },
    });
    return roleEntity
      ? {
          role: RoleMapper.toModel(roleEntity),
          translations: roleEntity.translations.map((translation) =>
            RoleTranslationMapper.toModel(translation),
          ),
        }
      : null;
  }

  async isSystemRoleExist(id: number): Promise<boolean> {
    const roleEntity = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    return !!roleEntity;
  }

  async countRolesWithPermissionsExcludingRoleId(
    permissionIds: number[],
    roleId?: number,
  ): Promise<number> {
    const results = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.permissions', 'permission')
      .where(roleId ? 'role.id != :roleId' : '1=1', { roleId })
      .groupBy('role.id')
      .having('COUNT(permission.id) = :exactCount', {
        exactCount: permissionIds.length,
      })
      .andHaving(
        'SUM(CASE WHEN permission.id IN (:...permissionIds) THEN 1 ELSE 0 END) = :matchCount',
        {
          permissionIds,
          matchCount: permissionIds.length,
        },
      )
      .select('role.id')
      .getRawMany();
    return results.length;
  }

  async countUsersWithOnlyRole(roleId: number): Promise<number> {
    const results = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin('role.users', 'user')
      .innerJoin('user.roles', 'all_roles')
      .where('role.id = :roleId', { roleId })
      .select('user.id')
      .groupBy('user.id')
      .having('COUNT(all_roles.id) = 1')
      .getRawMany();
    return results.length;
  }

  async save(
    roleModel: RoleModel,
    manager?: EntityManager,
  ): Promise<RoleModel> {
    const roleEntity = RoleMapper.toEntity(roleModel);
    const roleRepository =
      manager?.getRepository(RoleEntity) ?? this.roleRepository;
    const savedRoleEntity = await roleRepository.save(roleEntity);
    return RoleMapper.toModel(savedRoleEntity);
  }
}
