import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { INotificationRepository } from 'src/modules/notification/application/interfaces/notification-repository.interface';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationModel } from 'src/modules/notification/domain/models/notification.model';
import { NotificationMapper } from '../mapper/notification.mapper';

export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  async getById(id: number): Promise<NotificationModel | null> {
    const entity = await this.notificationRepository.findOneBy({ id });
    return entity ? NotificationMapper.toModel(entity) : null;
  }

  async getByMessageId(messageId: string): Promise<NotificationModel | null> {
    const entity = await this.notificationRepository.findOneBy({ messageId });
    return entity ? NotificationMapper.toModel(entity) : null;
  }

  async save(
    notification: NotificationModel,
    manager?: EntityManager,
  ): Promise<NotificationModel> {
    const entity = NotificationMapper.toEntity(notification);
    const notificationRepository =
      manager?.getRepository(NotificationEntity) ?? this.notificationRepository;
    const savedEntity = await notificationRepository.save(entity);
    return NotificationMapper.toModel(savedEntity);
  }
}
