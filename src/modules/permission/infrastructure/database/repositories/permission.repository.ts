import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, In, Like, QueryFailedError, Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permission.entity';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { GetAllPermissionQueryInput } from '../../../application/inputs/get-all-permission-query.input';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { AllowedPermissionOrderColumnEnum } from 'src/modules/permission/application/enums/allowed-permission-order-columns.enum';
import { IPermissionRepository } from '../../../application/interfaces/permission-repository.interface';
import { SlugifyHelper } from 'src/modules/shared/infrastructure/helpers/slugify.helper';
import { PermissionModel } from '../../../domain/models/permission.model';
import { PermissionMapper } from '../mappers/permission.mapper';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { GetAllPermissionsByLanguageViewModel } from 'src/modules/permission/application/view-models/get-all-permissions-by-language.view.model';
import { PermissionWithTranslationsViewModel } from 'src/modules/permission/application/view-models/permission-with-translations.view-model';
import { PermissionTranslationMapper } from '../mappers/permission-translation.mapper';
import { ErrorMappingResult } from 'src/modules/shared/infrastructure/database/types/error-mapping-result.type';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  private buildOrderQuery(order: IOrder<AllowedPermissionOrderColumnEnum>): FindOptionsOrder<PermissionEntity> {
    const { orderBy, orderDirection } = order
    const orderFieldMapping: Record<AllowedPermissionOrderColumnEnum, FindOptionsOrder<PermissionEntity>> = {
      [AllowedPermissionOrderColumnEnum.ID]: {
        id: orderDirection
      },
      [AllowedPermissionOrderColumnEnum.NAME]: {
        translations: {
          name: orderDirection
        }
      },
      [AllowedPermissionOrderColumnEnum.RESOURCE]: {
        resource: orderDirection
      },
      [AllowedPermissionOrderColumnEnum.LEVEL]: {
        level: orderDirection
      },
      [AllowedPermissionOrderColumnEnum.CREATED_AT]: {
        createdAt: orderDirection
      },
      [AllowedPermissionOrderColumnEnum.UPDATED_AT]: {
        updatedAt: orderDirection
      }
    }
    return orderFieldMapping[orderBy] ?? {
      createdAt: 'DESC'
    };
  }

  async getAllPaginatedAndTotalCount(query: GetAllPermissionQueryInput, order: IOrder<AllowedPermissionOrderColumnEnum>, pagination: Pagination): Promise<{ models: GetAllPermissionsByLanguageViewModel[]; count: number; }> {
    const { language, resource, name } = query;
    const [entities, count] = await this.permissionRepository.findAndCount({
      where: {
        translations: {
          language,
          slug: name ? Like(`%${SlugifyHelper.slugify(name)}%`) : undefined,
        },
        resource,
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
        resource: true,
        actions: true,
        level: true,
        isDeletable: true,
        createdAt: true,
        updatedAt: true,
      },
      order: this.buildOrderQuery(order),
      skip: pagination.skip,
      take: pagination.take,
    });
    return { 
      models: entities.map(entity => this.mapToGetAllPermissionsByLanguageViewModel(entity)), 
      count 
    }
  }

  private mapToGetAllPermissionsByLanguageViewModel(entity: PermissionEntity): GetAllPermissionsByLanguageViewModel {
    return {
      id: entity.id,
      name: entity.translations[0].name,
      description: entity.translations[0].description,
      resource: entity.resource,
      actions: entity.actions,
      level: entity.level,
      isDeletable: entity.isDeletable,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  async getByIds(ids: number[]): Promise<PermissionModel[]> {
    if (!ids.length) {
      return [];
    }
    const permissionEntities = await this.permissionRepository.find({
      where: {
        id: In(ids),
      },
    });
    return permissionEntities.map(permissionEntity => PermissionMapper.toModel(permissionEntity));
  }

  async getById(id: number): Promise<PermissionModel | null> {
    const permissionEntity = await this.permissionRepository.findOneBy({ id });
    return permissionEntity ? PermissionMapper.toModel(permissionEntity) : null;
  }

  async getWithTranslationsById(id: number): Promise<PermissionWithTranslationsViewModel | null> {
    const permissionEntity = await this.permissionRepository.findOne({
      where: { 
        id,
       },
      relations: { translations: true },
    });
    return permissionEntity ? {
      permission: PermissionMapper.toModel(permissionEntity),
      translations: permissionEntity.translations.map(translation => PermissionTranslationMapper.toModel(translation)),
    } : null;
  }

  getCountByResourceAndActions(resource: ResourceEnum, actions: ActionEnum[], permissionId?: number): Promise<number> {
    const query = this.permissionRepository.createQueryBuilder('permission')
      .where('permission.resource = :resource', { resource })
      .andWhere('permission.actions = :actions', { actions })
    if(permissionId) {
      query.andWhere('permission.id != :permissionId', { permissionId });
    }
    return query.getCount();
  }

  async countRolesWithOnlyPermission(permissionId: number): Promise<number> {
    const results = await this.permissionRepository.createQueryBuilder('permission')
    .innerJoin('permission.roles', 'role')
    .innerJoin('role.permissions', 'all_permissions')
    .where('permission.id = :permissionId', { permissionId })
    .select('role.id')
    .groupBy('role.id')
    .having('COUNT(all_permissions.id) = 1')
    .getRawMany();
    return results.length;
  }

  async save(permissionModel: PermissionModel, manager?: EntityManager): Promise<PermissionModel> {
    try {
      const permissionEntity = PermissionMapper.toEntity(permissionModel);
      const permissionRepository = manager?.getRepository(PermissionEntity) ?? this.permissionRepository;
      const savedPermissionEntity = await permissionRepository.save(permissionEntity);
      return PermissionMapper.toModel(savedPermissionEntity);
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint: 'permissions_resource_actions_partial_unique_index',
        error: new ConflictError('permission.resource_actions.duplicate'),
      },
    ];
    const errorException = errorMappingResult.find(errorException => (error as any).driverError.constraint === errorException.constraint);
    throw errorException?.error ?? error;
  }
}
