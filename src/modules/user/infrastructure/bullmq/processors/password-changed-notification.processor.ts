import { Inject } from "@nestjs/common";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { configService } from "src/infrastructure/configuration/services/config-instance.service";
import { NotificationChannelFinderService } from "../../../../notification/infrastructure/providers/services/notification-channel-finder.service";
import { NotificationSenderService } from "../../../../notification/application/services/notification.service";
import { ITranslationService } from "src/modules/shared/application/interfaces/translation-service.interface";
import { TRANSLATION_SERVICE } from "src/modules/shared/application/constant/translation-service.constant";
import { NotificationTemplateEnum } from "../../../../notification/application/enums/notification-template.enum";
import { NotificationEventEnum } from "../../../../notification/domain/enums/notification-event.enum";
import { PasswordChangedNotificationMessage } from "../../../application/notification/messages/password-changed-notification-message.input";

@Processor(configService.getString('BULLMQ_PASSWORD_CHANGED_QUEUE'))
export class PasswordChangedNotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    private readonly notificationSenderService: NotificationSenderService,
    @Inject(TRANSLATION_SERVICE) private readonly translationService: ITranslationService,    
  ) {
    super();
  }

  private getContext(message: PasswordChangedNotificationMessage): Record<string, string> {
    return {
      name: `${message.firstName} ${message.lastName}`,
    };
  }

  async process(job: Job<PasswordChangedNotificationMessage>): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(NotificationEventEnum.PASSWORD_CHANGED);
    const context = this.getContext(job.data);
    await this.notificationSenderService.send({
      channel,
      subject: this.translationService.translate('info.notification.subject.password_changed'),
      to: job.data.email,
      context,
      template: NotificationTemplateEnum.PASSWORD_CHANGED,
    });
  }
}
