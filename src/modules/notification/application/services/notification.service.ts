import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IChannelStrategy } from 'src/modules/notification/application/interfaces/channel-strategy.interface';
import { NotificationOptionsType } from 'src/modules/notification/application/types/notification-options.type';
import { NOTIFICATION_REPOSITORY } from '../constants/notification-repository.constant';
import { INotificationRepository } from '../interfaces/notification-repository.interface';
import { NotificationResultType } from '../types/notification-result.type';
import { NotificationModel } from '../../domain/models/notification.model';

@Injectable()
export class NotificationSenderService {
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  private async saveNotificationMessage(
    options: NotificationOptionsType,
    results: NotificationResultType,
  ): Promise<void> {
    const notification = new NotificationModel({
      channel: options.channel,
      to: options.to,
      subject: options.subject,
      template: options.template,
      context: options.context,
      messageId: results.messageId,
      status: results.status,
    });
    await this.notificationRepository.save(notification);
  }

  async send(options: NotificationOptionsType): Promise<void> {
    const service = this.moduleRef.get<IChannelStrategy>(options.channel);
    const results = await service.send(options);
    await this.saveNotificationMessage(options, results);
  }
}
