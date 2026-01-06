import { Inject, Injectable } from '@nestjs/common';
import { INotificationService } from 'src/modules/notification/application/interfaces/notification-service.interface';
import { QUEUE_PUBLISHER_SERVICE } from 'src/modules/shared/application/constant/queue-publisher-service.constant';
import { IQueuePublisherService } from 'src/modules/shared/application/interfaces/queue-publisher-service.interface';
import { NotificationMessage } from 'src/modules/notification/application/messages/notification.message';
import { NOTIFICATION_QUEUE_MAPPING } from 'src/modules/notification/application/constants/notification-queue-mapping.constant';
import { SetFirstPasswordNotificationMessage } from 'src/modules/user/application/notification/messages/set-first-password.message';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(
    @Inject(QUEUE_PUBLISHER_SERVICE)
    private readonly queuePublisherService: IQueuePublisherService,
    @Inject(NOTIFICATION_QUEUE_MAPPING)
    private readonly notificationQueueMapping: Map<NotificationMessage, string>,
  ) {}

  async send(message: NotificationMessage): Promise<void> {
    const queue = this.notificationQueueMapping.get(message.constructor);
    await this.queuePublisherService.publish(queue, message);
  }
}
