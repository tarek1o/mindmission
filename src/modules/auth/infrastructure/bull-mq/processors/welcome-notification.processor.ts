import { Inject } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { configService } from 'src/infrastructure/configuration/services/config-instance.service';
import { ITranslationService } from 'src/modules/shared/application/interfaces/translation-service.interface';
import { TRANSLATION_SERVICE } from 'src/modules/shared/application/constant/translation-service.constant';
import { NotificationTemplateEnum } from 'src/modules/notification/application/enums/notification-template.enum';
import { NotificationChannelFinderService } from 'src/modules/notification/infrastructure/providers/services/notification-channel-finder.service';
import { NotificationSenderService } from 'src/modules/notification/application/services/notification.service';
import { WelcomeNotificationMessage } from 'src/modules/auth/application/notification/messages/welcome-notification-message';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';

@Processor(configService.getString('BULLMQ_WELCOME_QUEUE'))
export class WelcomeNotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    private readonly notificationSenderService: NotificationSenderService,
    @Inject(TRANSLATION_SERVICE)
    private readonly translationService: ITranslationService,
  ) {
    super();
  }

  private getContext(
    message: WelcomeNotificationMessage,
  ): Record<string, string> {
    return {
      name: `${message.firstName} ${message.lastName}`,
    };
  }

  async process(job: Job<WelcomeNotificationMessage>): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(
      NotificationEventEnum.WELCOME,
    );
    const context = this.getContext(job.data);
    await this.notificationSenderService.send({
      channel,
      subject: this.translationService.translate(
        'info.notification.subject.welcome',
      ),
      to: job.data.email,
      context,
      template: NotificationTemplateEnum.WELCOME,
    });
  }
}
