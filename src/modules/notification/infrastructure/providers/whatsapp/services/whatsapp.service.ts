import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { NotificationOptionsType } from 'src/modules/notification/application/types/notification-options.type';
import { IChannelStrategy } from 'src/modules/notification/application/interfaces/channel-strategy.interface';
import { LOGGER_SERVICE } from 'src/modules/shared/application/constant/logger-service.constant';
import { NotificationResultType } from 'src/modules/notification/application/types/notification-result.type';
import { NotificationStatusEnum } from 'src/modules/notification/domain/enums/notification-status.enum';

@Injectable()
export class WhatsappService implements IChannelStrategy {
  constructor(@Inject(LOGGER_SERVICE) private readonly logger: LoggerService) {}

  async send(
    options: NotificationOptionsType,
  ): Promise<NotificationResultType> {
    this.logger.log(
      `Sending WhatsApp message to ${options.to}`,
      WhatsappService.name,
    );
    return {
      status: NotificationStatusEnum.FAILED,
      messageId: '',
    };
  }
}
