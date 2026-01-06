import { Inject, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IUserProfileChangeRepository } from 'src/modules/user/application/interfaces/user-profile-change-repository.interface';
import { UserProfileChangeEntity } from '../entities/user-profile-change.entity';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { UserProfileChangeModel } from 'src/modules/user/domain/models/user-profile-change.model';
import { UserProfileChangeMapper } from '../mappers/user-profile-change.mapper';
import { UserProfileFieldEnum } from 'src/modules/user/domain/enums/user-profile-field.enum';
import { ErrorMappingResult } from 'src/modules/shared/infrastructure/database/types/error-mapping-result.type';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

export class UserProfileChangeRepository implements IUserProfileChangeRepository {
  constructor(
    @InjectRepository(UserProfileChangeEntity)
    private readonly userProfileChangeRepository: Repository<UserProfileChangeEntity>,
    @Inject(LOGGER_SERVICE) private readonly loggerService: LoggerService,
  ) {}

  async getById(id: number): Promise<UserProfileChangeModel | null> {
    const entity = await this.userProfileChangeRepository.findOneBy({ id });
    return entity ? UserProfileChangeMapper.toModel(entity) : null;
  }

  async getByUserId(userId: number): Promise<UserProfileChangeModel[]> {
    const entities = await this.userProfileChangeRepository.find({
      where: {
        userId,
      },
    });
    return entities.map((entity) => UserProfileChangeMapper.toModel(entity));
  }

  async getByUserIdAndField(
    userId: number,
    field: UserProfileFieldEnum,
  ): Promise<UserProfileChangeModel | null> {
    const entity = await this.userProfileChangeRepository.findOne({
      where: {
        userId,
        field,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return entity ? UserProfileChangeMapper.toModel(entity) : null;
  }

  async save(
    userProfileChangeModel: UserProfileChangeModel,
    manager?: EntityManager,
  ): Promise<UserProfileChangeModel> {
    try {
      const entity = UserProfileChangeMapper.toEntity(userProfileChangeModel);
      const userProfileChangeRepository =
        manager?.getRepository(UserProfileChangeEntity) ??
        this.userProfileChangeRepository;
      const savedEntity = await userProfileChangeRepository.save(entity);
      return UserProfileChangeMapper.toModel(savedEntity);
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint: 'user_profile_changes_user_id_field_partial_unique_index',
        error: new ConflictError('user_profile_change.duplicate'),
      },
    ];
    const errorException = errorMappingResult.find(
      (errorException) =>
        (error as any).driverError.constraint === errorException.constraint,
    );
    throw errorException?.error ?? error;
  }
}
