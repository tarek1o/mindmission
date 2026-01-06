import { BaseModelProps } from 'src/modules/shared/domain/interfaces/base-model-props.interface';
import { NotificationChannelEnum } from 'src/modules/notification/domain/enums/notification-channel.enum';
import { SuspendedReasonEnum } from '../enums/suspended-reason.enum';

export interface SuspendedAccountProps extends BaseModelProps {
  recipient: string;
  channel: NotificationChannelEnum;
  reason: SuspendedReasonEnum;
  suspendedUntil: Date;
}
