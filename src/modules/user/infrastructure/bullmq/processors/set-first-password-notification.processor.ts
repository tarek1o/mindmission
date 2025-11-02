import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { configService } from "src/infrastructure/configuration/services/config-instance.service";
import { NotificationSenderService } from "../../../../notification/application/services/notification.service";
import { NotificationTemplateEnum } from "../../../../notification/application/enums/notification-template.enum";
import { SetFirstPasswordNotificationMessage } from "../../../application/notification/messages/set-first-password.message";
import { UILinks } from "src/infrastructure/configuration/interfaces/sub-interfaces/ui-links.interface";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { ITranslationService } from "src/modules/shared/application/interfaces/translation-service.interface";
import { TRANSLATION_SERVICE } from "src/modules/shared/application/constant/translation-service.constant";
import { NotificationEventEnum } from "../../../../notification/domain/enums/notification-event.enum";
import { NotificationChannelFinderService } from "../../../../notification/infrastructure/providers/services/notification-channel-finder.service";

@Processor(configService.getString('BULLMQ_SET_FIRST_PASSWORD_QUEUE'))
export class SetFirstPasswordNotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    private readonly notificationSenderService: NotificationSenderService,
    private readonly configService: ConfigService<IEnvironmentConfiguration, true>,
    @Inject(TRANSLATION_SERVICE) private readonly translationService: ITranslationService,
  ) {
    super();
  }

  private getContext(message: SetFirstPasswordNotificationMessage): Record<string, string> {
    const { firstName, lastName, token } = message;
    const { setPasswordURL } = this.configService.get<UILinks>('uiLinks').dashboard;
    return {
      name: `${firstName} ${lastName}`,
      url: `${setPasswordURL}${token}`,
    };
  }

  async process(job: Job<SetFirstPasswordNotificationMessage>): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(NotificationEventEnum.SET_FIRST_PASSWORD);
    const context = this.getContext(job.data);
    await this.notificationSenderService.send({
      channel,  
      subject: this.translationService.translate('info.notification.subject.set_first_password'),
      to: job.data.email,
      context,
      template: NotificationTemplateEnum.SET_PASSWORD,
    });
  }
}