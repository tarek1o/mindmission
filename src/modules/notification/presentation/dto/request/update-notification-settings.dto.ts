import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationSettingsDto } from './create-notification-settings.dto';
import { NotificationSettingsInput } from 'src/modules/notification/application/inputs/notification-settings.input';

export class UpdateNotificationSettingsDto
  extends PartialType(CreateNotificationSettingsDto)
  implements Partial<NotificationSettingsInput> {}
