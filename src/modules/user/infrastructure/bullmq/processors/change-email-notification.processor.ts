import { Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import * as moment from 'moment';
import { NotificationChannelFinderService } from "src/modules/notification/infrastructure/providers/services/notification-channel-finder.service";
import { NotificationSenderService } from "../../../../notification/application/services/notification.service";
import { TRANSLATION_SERVICE } from "src/modules/shared/application/constant/translation-service.constant";
import { ITranslationService } from "src/modules/shared/application/interfaces/translation-service.interface";
import { ChangeEmailNotificationMessage } from "../../../application/notification/messages/change-email-notification-message.input";
import { NotificationTemplateEnum } from "../../../../notification/application/enums/notification-template.enum";
import { UILinks } from "src/infrastructure/configuration/interfaces/sub-interfaces/ui-links.interface";
import { IEnvironmentConfiguration } from "src/infrastructure/configuration/interfaces/config.interface";
import { UserTypeEnum } from "src/modules/user/domain/enums/user-type.enum";
import { configService } from "src/infrastructure/configuration/services/config-instance.service";
import { NotificationEventEnum } from "src/modules/notification/domain/enums/notification-event.enum";

@Processor(configService.getString('BULLMQ_CHANGE_EMAIL_QUEUE'))
export class ChangeEmailNotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    private readonly configService: ConfigService<IEnvironmentConfiguration, true>,
    private readonly notificationSenderService: NotificationSenderService,
    @Inject(TRANSLATION_SERVICE) private readonly translationService: ITranslationService,
  ) {
    super();
  }

  private getChangeEmailURL(userType: UserTypeEnum): string {
    const { dashboard, mainApp } = this.configService.get<UILinks>('uiLinks');
    const baseUrlUserTypeMap: Record<UserTypeEnum, string> = {
      [UserTypeEnum.ADMIN]: dashboard.changeEmailURL,
      [UserTypeEnum.INSTRUCTOR]: mainApp.changeEmailURL,
      [UserTypeEnum.STUDENT]: mainApp.changeEmailURL,
    }
    return baseUrlUserTypeMap[userType];
  }

  private getContext(message: ChangeEmailNotificationMessage): Record<string, string> {
    const changeEmailUrl = this.getChangeEmailURL(message.userTypes[0]);
    const remainingTime = moment(message.expirationDate).diff(moment(), 'minutes', true)
    return {
      name: `${message.firstName} ${message.lastName}`,
      url: `${changeEmailUrl}${message.token}`,
      remainingTime: Math.ceil(remainingTime).toString(),
    };
  }

  async process(job: Job<ChangeEmailNotificationMessage>): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(NotificationEventEnum.CHANGE_EMAIL);
    const context = this.getContext(job.data);
    await this.notificationSenderService.send({
      channel,
      subject: this.translationService.translate('info.notification.subject.change_email'),
      to: job.data.upcomingEmail,
      context,
      template: NotificationTemplateEnum.CHANGE_EMAIL,
    });
  }
}