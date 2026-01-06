import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOptionsOrder, Repository } from 'typeorm';
import { INotificationSettingsRepository } from 'src/modules/notification/application/interfaces/notification-settings-repository.interface';
import { NotificationSettingsEntity } from '../entities/notification-settings.entity';
import { AllowedNotificationSettingsOrderColumnsEnum } from 'src/modules/notification/application/enums/allowed-notification-settings-order-columns.enum';
import { GetAllNotificationSettingsQueryInput } from 'src/modules/notification/application/inputs/get-all-notification-settings-query.input';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';
import { NotificationSettingsModel } from 'src/modules/notification/domain/models/notification-settings.model';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { Pagination } from 'src/modules/shared/application/interfaces/pagination.interface';
import { NotificationSettingsMapper } from '../mapper/notification-settings.mapper';
import { ErrorMappingResult } from 'src/modules/shared/infrastructure/database/types/error-mapping-result.type';
import { ConflictError } from 'src/modules/shared/domain/errors/conflict.error';

@Injectable()
export class NotificationSettingsRepository implements INotificationSettingsRepository {
  constructor(
    @InjectRepository(NotificationSettingsEntity)
    private readonly notificationSettingsRepository: Repository<NotificationSettingsEntity>,
  ) {}

  private buildOrderQuery(
    order: IOrder<AllowedNotificationSettingsOrderColumnsEnum>,
  ): FindOptionsOrder<NotificationSettingsEntity> {
    const orderKeyColumnsMap: Record<
      AllowedNotificationSettingsOrderColumnsEnum,
      FindOptionsOrder<NotificationSettingsEntity>
    > = {
      [AllowedNotificationSettingsOrderColumnsEnum.ID]: {
        id: order.orderDirection,
      },
      [AllowedNotificationSettingsOrderColumnsEnum.NOTIFICATION_EVENT]: {
        notificationEvent: order.orderDirection,
      },
      [AllowedNotificationSettingsOrderColumnsEnum.NOTIFICATION_CHANNEL]: {
        notificationChannel: order.orderDirection,
      },
      [AllowedNotificationSettingsOrderColumnsEnum.CREATED_AT]: {
        createdAt: order.orderDirection,
      },
      [AllowedNotificationSettingsOrderColumnsEnum.UPDATED_AT]: {
        updatedAt: order.orderDirection,
      },
    };
    return orderKeyColumnsMap[order.orderBy];
  }

  async getAllPaginatedAndTotalCount(
    query: GetAllNotificationSettingsQueryInput,
    order: IOrder<AllowedNotificationSettingsOrderColumnsEnum>,
    pagination: Pagination,
  ): Promise<{ models: NotificationSettingsModel[]; count: number }> {
    const { notificationEvent, notificationChannel } = query;
    const [entities, count] =
      await this.notificationSettingsRepository.findAndCount({
        where: {
          notificationEvent,
          notificationChannel,
        },
        order: this.buildOrderQuery(order),
        skip: pagination.skip,
        take: pagination.take,
      });
    return {
      models: entities.map((entity) =>
        NotificationSettingsMapper.toModel(entity),
      ),
      count,
    };
  }

  async getById(id: number): Promise<NotificationSettingsModel | null> {
    const entity = await this.notificationSettingsRepository.findOneBy({ id });
    return entity ? NotificationSettingsMapper.toModel(entity) : null;
  }

  async getByEvent(
    event: NotificationEventEnum,
  ): Promise<NotificationSettingsModel | null> {
    const entity = await this.notificationSettingsRepository.findOneBy({
      notificationEvent: event,
    });
    return entity ? NotificationSettingsMapper.toModel(entity) : null;
  }

  async save(
    model: NotificationSettingsModel,
    manager?: EntityManager,
  ): Promise<NotificationSettingsModel> {
    try {
      const entity = NotificationSettingsMapper.toEntity(model);
      const notificationSettingsRepository =
        manager?.getRepository(NotificationSettingsEntity) ??
        this.notificationSettingsRepository;
      const savedEntity = await notificationSettingsRepository.save(entity);
      return NotificationSettingsMapper.toModel(savedEntity);
    } catch (error: unknown) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown) {
    const errorMappingResult: ErrorMappingResult[] = [
      {
        constraint: 'notification_settings_notification_event_unique_index',
        error: new ConflictError(
          'notification.settings.notification_event.duplicate',
        ),
      },
    ];
    const errorException = errorMappingResult.find(
      (errorException) =>
        (error as any).driverError.constraint === errorException.constraint,
    );
    throw errorException?.error ?? error;
  }
}
