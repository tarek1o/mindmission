import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { NotificationChannelEnum } from '../enums/notification-channel.enum';
import { NotificationStatusEnum } from '../enums/notification-status.enum';

export interface NotificationProps extends BaseModelProps {
  channel: NotificationChannelEnum;
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
  messageId?: string | null;
  status?: NotificationStatusEnum;
}
