import { Inject, LoggerService } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOptionsOrder, ILike, In, Not, Repository, ArrayContains, QueryFailedError } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { IUserRepository } from "src/modules/user/application/interfaces/user-repository.interface";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { Pagination } from "src/modules/shared/application/interfaces/pagination.interface";
import { AllowedUserOrderColumnsEnum } from "src/modules/user/application/enums/allowed-user-order-columns.enum";
import { GetAllUsersQueryInput } from "src/modules/user/application/inputs/get-all-users-query.input";
import { UserModel } from "src/modules/user/domain/models/user.model";
import { UserMapper } from "../mappers/user.mapper";
import { GetAllUsersPaginatedViewModel } from "src/modules/user/application/view-models/get-all-users-paginated.view-model";
import { UserProfileInfoViewModel } from "src/modules/user/application/view-models/user-profile-info.view.model";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";
import { ConflictError } from "src/modules/shared/domain/errors/conflict.error";
import { ErrorMappingResult } from "src/modules/shared/infrastructure/database/types/error-mapping-result.type";

export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  private buildOrderQuery(order: IOrder<AllowedUserOrderColumnsEnum>): FindOptionsOrder<UserEntity> {
    const { orderBy, orderDirection } = order
    const orderFieldMapping: Record<AllowedUserOrderColumnsEnum, FindOptionsOrder<UserEntity>> = {
      [AllowedUserOrderColumnsEnum.ID]: {
        id: orderDirection
      },
      [AllowedUserOrderColumnsEnum.FIRST_NAME]: {
        firstName: orderDirection
      },
      [AllowedUserOrderColumnsEnum.LAST_NAME]: {
        lastName: orderDirection
      },
      [AllowedUserOrderColumnsEnum.CREATED_AT]: {
        createdAt: orderDirection
      },
      [AllowedUserOrderColumnsEnum.UPDATED_AT]: {
        updatedAt: orderDirection
      },
    }
    return orderFieldMapping[orderBy] ?? { createdAt: 'DESC' };
  }

  async getAllPaginatedWithTotalCount(
    query: GetAllUsersQueryInput,
    order: IOrder<AllowedUserOrderColumnsEnum>,
    pagination: Pagination
  ): Promise<{ models: GetAllUsersPaginatedViewModel[]; count: number }> {
    const { firstName, lastName, email, type, mobilePhone, whatsAppNumber, isProtected, isBlocked } = query;
    const [entities, count] = await this.userRepository.findAndCount({
      where: {
        firstName: firstName ? ILike(`%${firstName}%`) : undefined,
        lastName: lastName ? ILike(`%${lastName}%`) : undefined,
        email: email ? ILike(`%${email}%`) : undefined,
        types: type ? ArrayContains([type]) : undefined,
        mobilePhone,
        whatsAppNumber,
        isProtected,
        isBlocked,
      },
      order: this.buildOrderQuery(order),
      skip: pagination.skip,
      take: pagination.take,
    })
    return {
      models: entities.map(entity => this.mapToGetAllPermissionsByLanguageViewModel(entity)),
      count,
    };
  }

  private mapToGetAllPermissionsByLanguageViewModel(entity: UserEntity): GetAllUsersPaginatedViewModel {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      isEmailVerified: entity.isEmailVerified,
      picture: entity.picture,
      types: entity.types,
      mobilePhone: entity.mobilePhone,
      whatsAppNumber: entity.whatsAppNumber,
      isProtected: entity.isProtected,
      isBlocked: entity.isBlocked,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  async getById(id: number): Promise<UserModel | null> {
    const entity = await this.userRepository.findOne({
      where: { id },
      relations: [
        'roles',
        'roles.permissions',
      ]
    })
    return entity ? UserMapper.toModel(entity) : null;
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    const entity = await this.userRepository.findOne({
      where: { email },
      relations: [
        'roles',
        'roles.permissions',
      ]
    })
    return entity ? UserMapper.toModel(entity) : null;
  }

  async getByIdsAndUserType(ids: number[], type: UserTypeEnum): Promise<{id: number, types: UserTypeEnum[]}[]> {
    const entities = await this.userRepository.find({
      where: { 
        id: In(ids),
        types: ArrayContains([type]),
      },
      select: {
        id: true,
        types: true,
      }
    });
    return entities.map(({ id, types }) => ({ id, types }));
  }

  async getProfileById(id: number): Promise<UserProfileInfoViewModel | null> {
    const entity = await this.userRepository.findOne({
      where: { id },
      relations: [
        'roles', 
        'roles.permissions'
      ],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        picture: true,
        types: true,
        mobilePhone: true,
        whatsAppNumber: true,
        roles: {
          id: true,
          permissions: {
            id: true,
            resource: true,
            actions: true,
            level: true,
          }
        }
      }
    })
    return entity ? this.mapToGetProfileByIdViewModel(entity) : null;
  }

  private mapToGetProfileByIdViewModel(entity: UserEntity): UserProfileInfoViewModel {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      picture: entity.picture,
      types: entity.types,
      mobilePhone: entity.mobilePhone,
      whatsAppNumber: entity.whatsAppNumber,
      roles: entity.roles.map(role => ({
        id: role.id,
        permissions: role.permissions.map(permission => ({
          id: permission.id,
          resource: permission.resource,
          actions: permission.actions,
          level: permission.level,
        })),
      })),
    }
  }

  async getByEmailExceptId(email: string, id?: number): Promise<{id: number, email: string} | null> {
    const entity = await this.userRepository.findOne({
      where: { 
        id: id ? Not(id) : undefined,
        email, 
      },
      select: {
        id: true,
        email: true,
      }
    });
    return entity ? { id: entity.id, email: entity.email } : null;
  }

  async save(userModel: UserModel, manager?: EntityManager): Promise<UserModel> {
    try {
      const entity = UserMapper.toEntity(userModel);
      const userRepository = manager?.getRepository(UserEntity) ?? this.userRepository;
      const savedEntity = await userRepository.save(entity);
      return UserMapper.toModel(savedEntity);
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint: 'users_email_partial_unique_index',
        error: new ConflictError('user.email.duplicate'),
      }
    ];
    const errorException = errorMappingResult.find(errorException => (error as any).driverError.constraint === errorException.constraint);
    throw errorException?.error ?? error;
  }
}