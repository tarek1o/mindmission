import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as moment from 'moment';
import { IEnvironmentConfiguration } from 'src/infrastructure/configuration/interfaces/config.interface';
import { UserTypeEnum } from 'src/modules/user/domain/enums/user-type.enum';
import { UILinks } from 'src/infrastructure/configuration/interfaces/sub-interfaces/ui-links.interface';
import { ITranslationService } from 'src/modules/shared/application/interfaces/translation-service.interface';
import { TRANSLATION_SERVICE } from 'src/modules/shared/application/constant/translation-service.constant';
import { configService } from 'src/infrastructure/configuration/services/config-instance.service';
import { NotificationChannelFinderService } from 'src/modules/notification/infrastructure/providers/services/notification-channel-finder.service';
import { NotificationSenderService } from 'src/modules/notification/application/services/notification.service';
import { NotificationEventEnum } from 'src/modules/notification/domain/enums/notification-event.enum';
import { NotificationTemplateEnum } from 'src/modules/notification/application/enums/notification-template.enum';
import { ResetPasswordNotificationMessage } from 'src/modules/auth/application/notification/messages/reset-password-notification.message';

@Processor(configService.getString('BULLMQ_RESET_PASSWORD_QUEUE'))
export class ResetPasswordNotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationChannelFinderService: NotificationChannelFinderService,
    private readonly configService: ConfigService<
      IEnvironmentConfiguration,
      true
    >,
    private readonly notificationSenderService: NotificationSenderService,
    @Inject(TRANSLATION_SERVICE)
    private readonly translationService: ITranslationService,
  ) {
    super();
  }

  private getResetPasswordURL(userType: UserTypeEnum): string {
    const { dashboard, mainApp } = this.configService.get<UILinks>('uiLinks');
    const baseUrlUserTypeMap: Record<UserTypeEnum, string> = {
      [UserTypeEnum.ADMIN]: dashboard.resetPasswordURL,
      [UserTypeEnum.INSTRUCTOR]: mainApp.resetPasswordURL,
      [UserTypeEnum.STUDENT]: mainApp.resetPasswordURL,
    };
    return baseUrlUserTypeMap[userType];
  }

  private getContext(
    message: ResetPasswordNotificationMessage,
  ): Record<string, string> {
    const resetPasswordUrl = this.getResetPasswordURL(message.userTypes[0]);
    const remainingTime = moment(message.expirationDate).diff(
      moment(),
      'minutes',
      true,
    );
    return {
      name: `${message.firstName} ${message.lastName}`,
      url: `${resetPasswordUrl}${message.token}`,
      remainingTime: Math.ceil(remainingTime).toString(),
    };
  }

  async process(job: Job<ResetPasswordNotificationMessage>): Promise<void> {
    const channel = await this.notificationChannelFinderService.getChannel(
      NotificationEventEnum.RESET_PASSWORD,
    );
    const context = this.getContext(job.data);
    await this.notificationSenderService.send({
      channel,
      subject: this.translationService.translate(
        'info.notification.subject.reset_password',
      ),
      to: job.data.email,
      context,
      template: NotificationTemplateEnum.RESET_PASSWORD,
    });
  }
}
