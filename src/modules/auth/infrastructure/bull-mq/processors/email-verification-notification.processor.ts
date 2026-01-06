import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { configService } from 'src/infrastructure/configuration/services/config-instance.service';
import * as moment from 'moment';
import { EmailVerificationNotificationMessage } from 'src/modules/auth/application/notification/messages/email-verification-notification.message.';
import { NotificationSenderService } from 'src/modules/notification/application/services/notification.service';
import { IEnvironmentConfiguration } from 'src/infrastructure/configuration/interfaces/config.interface';
import { TRANSLATION_SERVICE } from 'src/modules/shared/application/constant/translation-service.constant';
import { ITranslationService } from 'src/modules/shared/application/interfaces/translation-service.interface';
import { NotificationChannelFinderService } from 'src/modules/notification/infrastructure/providers/services/notification-channel-finder.service';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';
import { NotificationTemplateEnum } from 'src/modules/notification/application/enums/notification-template.enum';
import { UILinks } from 'src/infrastructure/configuration/interfaces/sub-interfaces/ui-links.interface';

@Processor(configService.getString('BULLMQ_EMAIL_VERIFICATION_QUEUE'))
export class EmailVerificationNotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    private readonly notificationSenderService: NotificationSenderService,
    private readonly configService: ConfigService<
      IEnvironmentConfiguration,
      true
    >,
    @Inject(TRANSLATION_SERVICE)
    private readonly translationService: ITranslationService,
  ) {
    super();
  }

  private getContext(
    message: EmailVerificationNotificationMessage,
  ): Record<string, string> {
    const { emailVerificationURL } =
      this.configService.get<UILinks>('uiLinks').mainApp;
    const remainingTime = moment(message.expirationDate).diff(
      moment(),
      'days',
      true,
    );
    return {
      name: `${message.firstName} ${message.lastName}`,
      url: `${emailVerificationURL}${message.token}`,
      remainingTime: Math.ceil(remainingTime).toString(),
    };
  }

  async process(job: Job<EmailVerificationNotificationMessage>): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(
      NotificationEventEnum.EMAIL_VERIFICATION,
    );
    const context = this.getContext(job.data);
    await this.notificationSenderService.send({
      channel,
      subject: this.translationService.translate(
        'info.notification.subject.email_verification',
      ),
      to: job.data.email,
      context,
      template: NotificationTemplateEnum.VERIFY_EMAIL,
    });
  }
}
