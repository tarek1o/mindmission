import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer/lib/sendmail-transport";
import { IChannelStrategy } from "src/modules/notification/application/interfaces/channel-strategy.interface";
import { LOGGER_SERVICE } from "src/modules/shared/application/constant/logger-service.constant";
import { NotificationOptionsType } from "src/modules/notification/application/types/notification-options.type";
import { NotificationResultType } from "src/modules/notification/application/types/notification-result.type";
import { NotificationStatusEnum } from "src/modules/notification/domain/enums/notification-status.enum";

@Injectable()
export class EmailService implements IChannelStrategy {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
  ) {}

  async send(options: NotificationOptionsType): Promise<NotificationResultType> {
    try {
      const { to, subject, template, context } = options;
      const sentMessageInfo: SentMessageInfo = await this.mailerService.sendMail({
        to,
        subject,
        template: `${template}.pug`,
        context
      });
      this.logger.log(`Send Email Info: ${JSON.stringify(sentMessageInfo)}`, EmailService.name);
      return {
        status: sentMessageInfo.rejected.length ? NotificationStatusEnum.FAILED : NotificationStatusEnum.SENT,
        messageId: sentMessageInfo.messageId
      }
    } catch (error) {
      this.logger.error(`Error sending email: ${error}`, EmailService.name);
      return {
        status: NotificationStatusEnum.FAILED,
        messageId: ''
      }
    }
  }
}